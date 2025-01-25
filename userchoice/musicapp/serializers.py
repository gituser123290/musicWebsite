from rest_framework import serializers
from .models import Song, Playlist, Album, Artist, Like, Comment, Subscription, PlaylistCollaborator
from django.contrib.auth.models import User
from authApp.serializers import UserSerializer



class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'
        
        
    def validate(self, data):
        if not data.get('image') and not data.get('image_url'):
            raise serializers.ValidationError("At least one image field must be provided.")
        if data.get('image') and data.get('image_url'):
            raise serializers.ValidationError("Only one image field should be provided.")
        return data
        
        
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
        
    def validate(self, data):
        if not data.get('song_cover') and not data.get('song_cover_url'):
            raise serializers.ValidationError("At least one image field must be provided.")
        if data.get('song_cover') and data.get('song_cover_url'):
            raise serializers.ValidationError("Only one image field should be provided.")
        return data


class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)  # for reading songs
    songs_id = serializers.PrimaryKeyRelatedField(queryset=Song.objects.all(), many=True, write_only=True)  # for writing song IDs

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'user', 'songs', 'songs_id', 'is_public', 'created_at']

    def update(self, instance, validated_data):
        # Handle fields like 'name', 'user', etc.
        instance.name = validated_data.get('name', instance.name)
        instance.user = validated_data.get('user', instance.user)
        instance.is_public = validated_data.get('is_public', instance.is_public)

        # Get the list of song IDs from validated_data
        song_ids = validated_data.get('songs_id', [])
        
        # Add each song by its ID (not the Song instance)
        for song_id in song_ids:
            song = Song.objects.get(id=song_id)  # Ensure you're using the song's ID, not the instance
            instance.songs.add(song)  # Add the song to the playlist

        instance.save()
        return instance

        

class AlbumSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True,read_only=True)
    artist=ArtistSerializer(read_only=True)
    artist_id=serializers.PrimaryKeyRelatedField(queryset=Artist.objects.all(),source='artist',write_only=True)
    
    class Meta:
        model = Album
        fields = ['id', 'name','artist','artist_id', 'release_date', 'songs', 'cover_image']
        
    def validate(self, data):
        if not data.get('cover_image') and not data.get('cover_image_url'):
            raise serializers.ValidationError("At least one image field must be provided.")
        if data.get('cover_image') and data.get('cover_image_url'):
            raise serializers.ValidationError("Only one image field should be provided.")
        return data


class LikeSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    class Meta:
        model = Like
        fields = ['id', 'user', 'song', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
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
