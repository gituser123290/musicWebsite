from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
from rest_framework import generics  
from rest_framework.parsers import MultiPartParser, FormParser,FileUploadParser # for image uploading
from rest_framework.permissions import IsAuthenticated
import os
import requests
from django.conf import settings

from django.db.models import Max

from .serializers import ArtistSerializer,AlbumSerializer,SongSerializer,AudioSerializer,PopularSongSerializer
from .models import Artist,Album,Song


class AlbumList(APIView):
    # serializer_class = AlbumSerializer
    parser_classes = (MultiPartParser, FormParser)
    def get(self, request):
        try:
            albums = Album.objects.all()
            serializer = AlbumSerializer(albums, many=True)
            return Response(serializer.data)
        except Album.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request):
        serializer = AlbumSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class AlbumDetail(APIView):
    def get(self, request, pk):
        album = get_object_or_404(Album, pk=pk)
        serializer = AlbumSerializer(album)
        return Response(serializer.data)
    
    def put(self, request, pk):
        album = get_object_or_404(Album, pk=pk)
        serializer = AlbumSerializer(album, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        album = get_object_or_404(Album, pk=pk)
        album.delete()
        return Response(status=204)
    


class ArtistList(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        artists = Artist.objects.all()
        serializer = ArtistSerializer(artists, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ArtistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

class ArtistDetail(APIView):
    def get(self, request, pk):
        artist = get_object_or_404(Artist, pk=pk)
        serializer = ArtistSerializer(artist)
        return Response(serializer.data)
    
    def put(self, request, pk):
        artist = get_object_or_404(Artist, pk=pk)
        serializer = ArtistSerializer(artist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        artist = get_object_or_404(Artist, pk=pk)
        artist.delete()
        return Response(status=204)
    

class SongList(APIView):
    # parser_classes = (MultiPartParser, FormParser)
    # parser_class = (FileUploadParser,)
    parser_classes = (MultiPartParser, FormParser,)
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        songs = Song.objects.all().order_by('-id')
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)
    
    # def post(self, request,format=None):
    #     serializer = SongSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data,status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=400)
    
    def post(self, request, format=None):
        if 'song_cover' in request.FILES:
            image_file = request.FILES['song_cover']
            image_filename = os.path.join(settings.MEDIA_ROOT, 'song_covers', image_file.name)
            with open(image_filename, 'wb+') as image_temp_file:
                for chunk in image_file.chunks():
                    image_temp_file.write(chunk)
        else:
            image_filename = None

        if 'audio_file' in request.FILES:
            my_file = request.FILES['audio_file']
            file_filename = os.path.join(settings.MEDIA_ROOT, 'audio_files', my_file.name)
            with open(file_filename, 'wb+') as file_temp_file:
                for chunk in my_file.chunks():
                    file_temp_file.write(chunk)
        else:
            file_filename = None
            
        data = request.data.copy()
        if image_filename:
            data['song_cover'] = image_filename
        if file_filename:
            data['audio_file'] = file_filename
            
        serializer = SongSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SongDetail(APIView):
    parser_classes = [MultiPartParser, FormParser]
    def get(self, request, pk):
        song = get_object_or_404(Song, pk=pk)
        serializer = SongSerializer(song)
        return Response(serializer.data)
    
    def put(self, request, pk):
        song = get_object_or_404(Song, pk=pk)
        serializer = SongSerializer(song, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
        
    def delete(self, request, pk):
        song = get_object_or_404(Song, pk=pk)
        song.delete()
        return Response(status=204)

class AudioFileListView(APIView):
    def get(self, request):
        songs = Song.objects.all()
        serializer = AudioSerializer(songs, many=True)
        return Response({"audio_files": serializer.data}, status=status.HTTP_200_OK)
 
class PopularSongView(APIView):
    def get(self, request, format=None):
        songs = Song.objects.all()[:4]
        popularity_scores = []
        for song in songs:
            popularity_score = song.calculate_popularity()  
            popularity_scores.append({
                'song_id': song.id,
                'name': song.name,
                'artist': song.artist.name,
                'streams': song.streams,
                'downloads': song.downloads,
                'album': song.album.title,
                'popularity_score': popularity_score,
                'audio_file': song.audio_file.url if song.audio_file else None
            })
        popularity_scores = sorted(popularity_scores, key=lambda x: x['popularity_score'], reverse=True)    
        return Response(popularity_scores, status=status.HTTP_200_OK) 
    
    
        
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
    def get(self, request,id):
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
            url='https://api.escuelajs.co/api/v1/products'
            response=requests.get(url)
            if response.status_code==200:
                products=response.json()
                return Response(products,status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Failed to fetch products data from Freee API"},
                    status=response.status_code,
                )
        except requests.exceptions.RequestException as e:
            return Response(
                {"error":f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class ProductDetailView(APIView):
    def get(self, request,id):
        try:
            url='https://api.escuelajs.co/api/v1/products'
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
