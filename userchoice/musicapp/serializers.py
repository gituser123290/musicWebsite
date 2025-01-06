from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from .models import Album,Artist,Song
from PIL import Image

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = "__all__"
        
class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = "__all__"
        
           
# class SongSerializer(serializers.ModelSerializer):
#     # Use the nested serializers for 'album' and 'artist'
#     album = AlbumSerializer(read_only=True)  # Include full data of album
#     artist = ArtistSerializer(read_only=True)  # Include full data of artist

#     class Meta:
#         model = Song
#         fields = '__all__'
        
        
#  If you want to handle the relationships explicitly (by including the album and artist IDs in POST requests): then use below serializer   
class SongSerializer(serializers.ModelSerializer):
    
    album = serializers.PrimaryKeyRelatedField(queryset=Album.objects.all())
    artist = serializers.PrimaryKeyRelatedField(queryset=Artist.objects.all())
    
    albums = AlbumSerializer(source='album',read_only=True)  # Include full data of album
    artists = ArtistSerializer(source='artist',read_only=True)  # Include full data of artist

    class Meta:
        model = Song
        fields='__all__'
        
        
        
    def validate_audio_file(self, value):
        if value:
            if not value.name.endswith(('.mp3', '.wav', '.ogg')):
                raise serializers.ValidationError("Please upload a valid audio file.")
        return value





class PopularSongSerializer(serializers.ModelSerializer):
    popularity_score = serializers.SerializerMethodField()
    artist=ArtistSerializer(source='artist', read_only=True)
    album=ArtistSerializer(source='album', read_only=True)

    class Meta:
        model = Song
        fields = ['id', 'title', 'album', 'artist', 'song_cover', 'audio_file', 
                  'no_of_listeners', 'streams', 'radio_airplay', 'downloads', 
                  'social_media_mentions', 'duration', 'genre', 'track_number', 
                  'popularity_score']

    def get_popularity_score(self, obj):
        # Calculate the popularity score using the model method
        return obj.calculate_popularity()

class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id','name','song_cover','audio_file']