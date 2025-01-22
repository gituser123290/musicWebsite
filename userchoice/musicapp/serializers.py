from rest_framework import serializers
from .models import Song, Playlist, Album, Artist, Like, Comment, Subscription, PlaylistCollaborator
from django.contrib.auth.models import User
from authApp.serializers import CustomUserSerializer



class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'
        
        
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class SongSerializer(serializers.ModelSerializer):
    artist=ArtistSerializer(read_only=True)
    artist_id=serializers.PrimaryKeyRelatedField(queryset=Artist.objects.all(),source='artist',write_only=True)

    class Meta:
        model = Song
        fields = '__all__'
        read_only_fields = ['user']


class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)
    class Meta:
        model = Playlist
        fields = ['id', 'name', 'user','songs', 'is_public', 'created_at']
        

class AlbumSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True,read_only=True)
    artist=ArtistSerializer(read_only=True)
    artist_id=serializers.PrimaryKeyRelatedField(queryset=Artist.objects.all(),source='artist',write_only=True)
    
    class Meta:
        model = Album
        fields = ['id', 'name','artist','artist_id', 'release_date', 'songs', 'cover_image']


class LikeSerializer(serializers.ModelSerializer):
    user=CustomUserSerializer(read_only=True)
    class Meta:
        model = Like
        fields = ['id', 'user', 'song', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    user=CustomUserSerializer(read_only=True)
    songs=SongSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'user', 'song','songs', 'content', 'created_at']

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'user', 'artist', 'created_at']
        read_only_fields =['user']

class PlaylistCollaboratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaylistCollaborator
        fields = ['id', 'playlist', 'user', 'role']
        
class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id','title','song_cover','audio']
