from rest_framework import serializers
from .models import Song, Playlist, Album, Artist, Like, Comment, Subscription, PlaylistCollaborator
from django.contrib.auth.models import User

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id', 'title', 'artist', 'genre', 'duration', 'file', 'user', 'created_at']
        read_only_fields = ['user']

class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True)
    class Meta:
        model = Playlist
        fields = ['id', 'name', 'user', 'songs', 'is_public', 'created_at']

class AlbumSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True)
    class Meta:
        model = Album
        fields = ['id', 'name', 'artist', 'release_date', 'songs', 'cover_image']

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ['id', 'name', 'bio','image', 'website', 'social_media']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'song', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'song', 'content', 'created_at']

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'user', 'artist', 'created_at']

class PlaylistCollaboratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaylistCollaborator
        fields = ['id', 'playlist', 'user', 'role']
