import requests
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.exceptions import NotFound
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FileUploadParser

from .models import Song, Playlist, Album, Artist, Like, Comment, Subscription, PlaylistCollaborator
from .serializers import SongSerializer, AudioSerializer, PlaylistSerializer, AlbumSerializer, ArtistSerializer, LikeSerializer, CommentSerializer, SubscriptionSerializer, PlaylistCollaboratorSerializer


# Song Views
class SongCreateAPIView(generics.CreateAPIView):
    parser_classes = [MultiPartParser, FileUploadParser]
    serializer_class = SongSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SongListAPIView(generics.ListAPIView):
    serializer_class = SongSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Song.objects.all()


class SongRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    parser_classes = [MultiPartParser, FileUploadParser]
    serializer_class = SongSerializer
    permission_classes = [IsAuthenticated]
    queryset = Song.objects.all()

    def perform_update(self, serializer):
        return serializer.save(modified_by=self.request.user)

    def perform_destroy(self, instance):
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
                
    
class PlaylistUpdateAPIView(generics.UpdateAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes=[TokenAuthentication]
    queryset = Playlist.objects.all()
    
    
    def update(self, request, *args, **kwargs):
        playlist = self.get_object()
        song_ids = request.data.get('songs_id',[])
        
        if not song_ids:
            return Response({"detail": "No song IDs provided."}, status=status.HTTP_400_BAD_REQUEST)

        songs = Song.objects.filter(id__in=song_ids)
        if len(songs) != len(song_ids): 
            return Response({"detail": "Some song IDs are invalid."}, status=status.HTTP_400_BAD_REQUEST)

        playlist.songs.add(*songs)
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
class AlbumCreateAPIView(generics.CreateAPIView):
    parser_classes = [MultiPartParser, FileUploadParser]
    serializer_class = AlbumSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes=[TokenAuthentication]

    def perform_create(self, serializer):
        serializer.save()


class AlbumListAPIView(generics.ListAPIView):
    serializer_class = AlbumSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Album.objects.all()


class AlbumUpdateAPIView(generics.RetrieveUpdateAPIView):
    parser_classes = [MultiPartParser, FileUploadParser]
    serializer_class = AlbumSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes=[TokenAuthentication]
    queryset = Album.objects.all()

    def perform_update(self, serializer):
        return serializer.save(modified_by=self.request.user)
    


class AlbumDeleteAPIView(generics.DestroyAPIView):
    permissions_classes = [IsAuthenticated]
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    authentication_classes=[TokenAuthentication]

    def perform_destroy(self, instance):
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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


# Like Views
class LikeListAPIView(generics.ListAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        song_id = self.kwargs.get('song_id')
        return Like.objects.filter(song_id=song_id)
    
    def list(self, request, *args, **kwargs):
        song_id = self.kwargs.get('song_id')
        song = Song.objects.filter(id=song_id).first()
        if not song:
            raise NotFound("Song not found.")

        likes = Like.objects.filter(song=song)

        return Response(LikeSerializer(likes, many=True).data)

class LikeCreateAPIView(generics.CreateAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    def perform_create(self, serializer):
        song_id = self.kwargs.get('song_id')

        try:
            song = Song.objects.get(id=song_id)
        except Song.DoesNotExist:
            raise NotFound("Song not found.")
        
        like = Like.objects.filter(user=self.request.user, song=song).first()

        if like:
            like.delete()
        else:
            serializer.save(user=self.request.user, song=song)

        like_count = Like.objects.filter(song=song).count()
        return Response(like_count, status=status.HTTP_200_OK)
        

class LikeRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]
    queryset = Like.objects.all()


# Comment Views
class CommentListAPIView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        song_id = self.kwargs.get('song_id')  
        return Comment.objects.filter(song_id=song_id)
    

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
class CommentCreateAPIView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CommentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Comment.objects.all()


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
