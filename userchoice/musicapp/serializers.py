from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response

from django.conf import settings

from .models import Album,Artist,Song

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = "__all__"
        
class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = "__all__"
           
class SongSerializer(serializers.ModelSerializer):
    # Receive the primary key (ID) for album and artist in POST request
    album = serializers.PrimaryKeyRelatedField(queryset=Album.objects.all())
    artist = serializers.PrimaryKeyRelatedField(queryset=Artist.objects.all())
    
    # Show the full content of album and artist in GET response using nested serializers
    album_detail = AlbumSerializer(source='album', read_only=True)
    artist_detail = ArtistSerializer(source='artist', read_only=True)
    
    class Meta:
        model = Song
        fields = '__all__'
        

class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id','title','song_cover','audio_file']