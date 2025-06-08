from django.http import Http404
import requests
from mutagen import File
import os
from rest_framework.exceptions import NotFound, PermissionDenied
import tempfile
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.exceptions import NotFound
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FileUploadParser,FormParser,JSONParser
from pydub.utils import mediainfo
from django.db.models import Q
from .models import *
from .serializers import *



class SearchAPIView(APIView):
    def get(self, request, format=None):
        query = request.query_params.get('q', '').strip()

        if not query:
            return Response(
                {"detail": "Query parameter `q` is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Search Songs
        songs = Song.objects.filter(
            Q(title__icontains=query) |
            Q(artist__name__icontains=query)  # Assuming 'artist' is a ForeignKey
        ).distinct()

        # Search Artists
        artists = Artist.objects.filter(
            Q(name__icontains=query)
        ).distinct()

        song_data = SongSerializer(songs, many=True).data
        artist_data = ArtistSerializer(artists, many=True).data

        return Response({
            "songs": song_data,
            "artists": artist_data
        }, status=status.HTTP_200_OK)
    
class RecentlyPlayedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        songs = RecentlyPlayed.objects.filter(user=request.user).order_by('-played_at')[:20]
        serializer = RecentlyPlayedSerializer(songs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id  # inject user manually
        serializer = RecentlyPlayedSerializer(data=data)
        if serializer.is_valid():
            RecentlyPlayed.objects.create(
                user=request.user,
                song_title=serializer.validated_data['song_title'],
                artist_name=serializer.validated_data.get('artist_name', ''),
                image_url=serializer.validated_data.get('image_url', '')
            )
            return Response({"message": "Added to recently played"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
       
# # Song Views
class BulkCreateSongAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        
        if not isinstance(data, list):
            return Response({'error': 'Expected a list of song objects'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = SongSerializers(data=data, many=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Songs created successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class SongCreateAPIView(generics.CreateAPIView):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    serializer_class = SongSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        # Save the song instance with the user info
        song_instance = serializer.save(user=self.request.user)

        # Get the audio file from the request
        audio_file = self.request.FILES.get('audio')

        # Initialize duration as "00:00:00" by default
        duration_formatted = "00:00:00"

        if audio_file:
            try:
                # Save the uploaded audio file to a temporary location
                with tempfile.NamedTemporaryFile(delete=False) as temp_audio_file:
                    for chunk in audio_file.chunks():
                        temp_audio_file.write(chunk)
                    temp_audio_file_path = temp_audio_file.name

                # Try using mediainfo to get the audio duration
                audio_info = mediainfo(temp_audio_file_path)
                if 'duration' in audio_info:
                    duration_seconds = float(audio_info['duration'])
                    duration_formatted = self.format_duration(duration_seconds)
                else:
                    print("Mediainfo could not retrieve the duration.")
                    duration_formatted = "00:00:00"

                # Save the calculated duration to the Song model and persist it
                song_instance.audio_duration = duration_formatted
                song_instance.save()  # This ensures the audio_duration is saved permanently in the database

                # Clean up the temporary file
                os.remove(temp_audio_file_path)

            except Exception as e:
                print(f"Error retrieving duration: {e}")
                duration_formatted = "00:00:00"

        # Serialize the song instance and add the audio duration
        song_data = SongSerializer(song_instance).data
        song_data['audio_duration'] = song_instance.audio_duration  # Ensure the updated field is included in the response

        return Response(song_data)

class SongAPIView(APIView):
    parser_classes = [MultiPartParser, FileUploadParser]

    def get_permissions(self):
        if self.request.method in ['GET']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request, song_id=None):
        if song_id is None:
            songs = Song.objects.all().order_by('-id')
            serializer = SongSerializer(songs, many=True)
            return Response(serializer.data)

        song = Song.objects.filter(id=song_id).first()
        if not song:
            raise NotFound("Song not found.")
        serializer = SongSerializer(song)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = SongSerializer(data=request.data)
        if serializer.is_valid():
            audio_file = request.FILES.get('audio')
            if audio_file:
                try:
                    audio = File(audio_file)
                    if audio is None or not hasattr(audio, 'info') or not hasattr(audio.info, 'length'):
                        return Response({"error": "Unsupported or unreadable audio format."}, status=400)
                    duration = round(audio.info.length, 2)  # in seconds
                    song = serializer.save(user=request.user, duration=duration)
                    return Response(SongSerializer(song).data, status=status.HTTP_201_CREATED)

                except Exception as e:
                    return Response({"error": f"Failed to process audio file: {str(e)}"}, status=400)

            return Response({"error": "No audio file provided."}, status=400)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, song_id=None):
        song = Song.objects.filter(id=song_id).first()
        if not song:
            raise NotFound("Song not found.")
        serializer = SongSerializer(song, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(modified_by=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, song_id=None):
        song = Song.objects.filter(id=song_id).first()
        if not song:
            raise NotFound("Song not found.")
        song.delete()
        return Response({"detail": "Song deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

# Playlist Views
class PlaylistListAPIView(generics.ListAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Playlist.objects.filter(user=self.request.user)
    
    
    def list(self, request, *args, **kwargs):
        playlists = self.get_queryset()
        serialized_playlists = PlaylistSerializer(playlists, many=True)
        return Response(serialized_playlists.data)

        
class PlaylistCreateAPIView(generics.CreateAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes=[TokenAuthentication]
    
    def perform_create(self, serializer):
        playlist = serializer.save(user=self.request.user)
        song_ids = self.request.data.get('songs_id')
        if song_ids:
            songs = Song.objects.filter(id__in=song_ids)
            if songs.count() != len(song_ids):
                return Response({"detail": "Some of the provided songs were not found."}, status=status.HTTP_400_BAD_REQUEST)
            playlist.songs.set(songs)
        return playlist

class PlaylistCreateAPIView(generics.CreateAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class LikedSongs(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        liked_songs = Like.objects.filter(user=request.user).order_by('-created_at')
        serializer = LikeSerializer(liked_songs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
                

class PlaylistUpdateAPIView(generics.UpdateAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes=[TokenAuthentication]
    queryset = Playlist.objects.all()

    
    def update(self, request, *args, **kwargs):
        # Get the playlist object that belongs to the authenticated user
        try:
            playlist = self.get_object()
            if playlist.user != request.user:
                return Response({"detail": "You do not have permission to modify this playlist."}, status=status.HTTP_403_FORBIDDEN)
        except Playlist.DoesNotExist:
            return Response({"detail": "Playlist not found."}, status=status.HTTP_404_NOT_FOUND)

        # Get the song_id from the request
        song_id = request.data.get('song_id')
        if not song_id:
            return Response({"detail": "Song ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            song = Song.objects.get(id=song_id)
        except Song.DoesNotExist:
            return Response({"detail": "Song not found."}, status=status.HTTP_404_NOT_FOUND)

        # Add the song to the playlist
        playlist.songs.add(song)

        # Return the updated playlist data
        serializer = PlaylistSerializer(playlist)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class PlaylistDeleteAPIView(generics.DestroyAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes=[TokenAuthentication]
    queryset = Playlist.objects.all()
    
    def perform_destroy(self, instance):
        instance.delete()
        return Response(instance,status=status.HTTP_204_NO_CONTENT)
    
    
class PlaylistDestroyAPIView(generics.RetrieveDestroyAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes=[TokenAuthentication]
    queryset = Playlist.objects.all()
    
    def get_object(self):
        playlist = Playlist.objects.get(id=self.kwargs['playlist_id'])

        song = Song.objects.get(id=self.kwargs['song_id'])
        if song not in playlist.songs.all():
            raise ValidationError("Song not found in the playlist.")

        return song

    def perform_destroy(self, instance):
        playlist = Playlist.objects.get(id=self.kwargs['playlist_id'])
        song = instance 
        playlist.songs.remove(song)
        playlist.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Album Views
class AlbumAPIView(APIView):
    parser_classes = [MultiPartParser, FileUploadParser]
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request, album_id=None):
        if album_id is None:
            albums = Album.objects.all()
            serializer = AlbumSerializer(albums, many=True)
            return Response(serializer.data)
        
        album = Album.objects.filter(id=album_id).first()
        if not album:
            raise NotFound("Album not found.")
        serializer = AlbumSerializer(album)
        return Response(serializer.data)

    def post(self, request):
        serializer = AlbumSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # You can also add uploaded_by=request.user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, album_id=None):
        album = Album.objects.filter(id=album_id).first()
        if not album:
            raise NotFound("Album not found.")
        serializer = AlbumSerializer(album, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(modified_by=request.user)  # Ensure 'modified_by' is in your model
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, album_id=None):
        album = Album.objects.filter(id=album_id).first()
        if not album:
            raise NotFound("Album not found.")
        album.delete()
        return Response({"detail": "Album deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class TopAlbumsAPIView(APIView):
    def get(self, request):
        albums = Album.objects.filter(top_album=True).order_by('-release_date')[:10]  
        serializer = AlbumSerializer(albums, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
# Artist Views
class ArtistListAPIView(generics.ListAPIView):
    parser_classes = [MultiPartParser, FileUploadParser]
    serializer_class = ArtistSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes=[TokenAuthentication]

    def get_queryset(self):
        return Artist.objects.all()

        
class ArtistCreateAPIView(generics.CreateAPIView):
    parser_classes = [MultiPartParser, FileUploadParser]
    serializer_class = ArtistSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes=[TokenAuthentication]

    def perform_create(self, serializer):
        serializer.save()


class ArtistRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ArtistSerializer
    queryset = Artist.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes=[TokenAuthentication]
    
    
    def patch(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class LikeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, song_id):
        song = Song.objects.filter(id=song_id).first()
        if not song:
            raise NotFound("Song not found.")

        likes = Like.objects.filter(song=song)
        serializer = LikeSerializer(likes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, song_id):
        user=request.user
        print("1",user)
        try:
            song = Song.objects.get(id=song_id)
        except Song.DoesNotExist:
            raise NotFound("Song not found.")

        existing_like = Like.objects.filter(user=user, song=song).first()
        print("2",existing_like)
        if existing_like:
            return Response({"detail": "You have already liked this song."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = LikeSerializer(data=request.data)
        print("3",serializer)
        if serializer.is_valid():
            serializer.save(user=user, song=song)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, song_id):
        try:
            like = Like.objects.select_related('song', 'user').get(user=request.user, song_id=song_id)
        except Like.DoesNotExist:
            raise NotFound("Like does not exist.")

        like.delete()
        return Response({"detail": "Like removed successfully."}, status=status.HTTP_204_NO_CONTENT)

# Comment Views
class CommentAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, song_id=None, comment_id=None):
        if song_id and not comment_id:
            comments = Comment.objects.filter(song_id=song_id)
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if comment_id:
            comment = Comment.objects.filter(id=comment_id, song_id=song_id).first()
            if not comment:
                raise NotFound("Comment not found.")
            serializer = CommentSerializer(comment)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"detail": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, song_id=None):
        try:
            song = Song.objects.get(id=song_id)
        except Song.DoesNotExist:
            raise NotFound("Song not found.")

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, song=song)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, song_id=None, comment_id=None):
        comment = Comment.objects.filter(id=comment_id, song_id=song_id).first()
        if not comment:
            raise NotFound("Comment not found.")
        if comment.user != request.user:
            raise PermissionDenied("You can only update your own comment.")

        serializer = CommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, song_id=None, comment_id=None):
        comment = Comment.objects.filter(id=comment_id, song_id=song_id).first()
        if not comment:
            raise NotFound("Comment not found.")
        if comment.user != request.user:
            raise PermissionDenied("You can only delete your own comment.")

        comment.delete()
        return Response({"detail": "Comment deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

# Subscription Views
class SubscriptionListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SubscriptionRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]
    queryset = Subscription.objects.all()


# Playlist Collaborator Views
class PlaylistCollaboratorListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PlaylistCollaboratorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PlaylistCollaborator.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PlaylistCollaboratorRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PlaylistCollaboratorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = PlaylistCollaborator.objects.all()

# Audio Files View
class AudioFiles(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        songs = Song.objects.all()
        serializer = AudioSerializer(songs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# External API Views
FREEE_API_URL = 'https://api.escuelajs.co/api/v1/users'

class UserApiView(APIView):

    def get(self, request):
        try:
            response = requests.get(FREEE_API_URL)
            if response.status_code == 200:
                users_data = response.json()
                return Response(users_data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Failed to fetch users data from Freee API"},
                    status=response.status_code,
                )
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class UserDetailView(APIView):
    def get(self, request, id):
        try:
            response = requests.get(f"{FREEE_API_URL}/{id}")
            if response.status_code == 200:
                user_data = response.json()
                return Response(user_data, status=status.HTTP_200_OK)
            elif response.status_code == 404:
                raise NotFound(detail="User not found.")
            else:
                return Response(
                    {"error": "Failed to fetch user data from Freee API"},
                    status=response.status_code,
                )
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class ProductApi(APIView):

    def get(self, request):
        try:
            url = 'https://api.escuelajs.co/api/v1/products'
            response = requests.get(url)
            if response.status_code == 200:
                products = response.json()
                return Response(products, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Failed to fetch products data from Freee API"},
                    status=response.status_code,
                )
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class ProductDetailView(APIView):
    def get(self, request, id):
        try:
            url = 'https://api.escuelajs.co/api/v1/products'
            response = requests.get(f"{url}/{id}")
            if response.status_code == 200:
                user_data = response.json()
                return Response(user_data, status=status.HTTP_200_OK)
            elif response.status_code == 404:
                raise NotFound(detail="User not found.")
            else:
                return Response(
                    {"error": "Failed to fetch user data from Freee API"},
                    status=response.status_code,
                )
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
            
class FeaturedPlaylistsAPIView(APIView):
    def get(self, request):
        try:
            playlists = Playlist.objects.filter(featured=True)
            serializer = PlaylistSerializer(playlists, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)