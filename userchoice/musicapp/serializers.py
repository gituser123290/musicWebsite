from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from authApp.serializers import UserProfileSerializer
from pydub.utils import mediainfo


class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class SongSerializers(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = '__all__'
        read_only_fields = ['user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SongSerializer(serializers.ModelSerializer):
    audio = serializers.FileField(required=False, allow_null=True)
    artist = ArtistSerializer(read_only=True)
    artist_id = serializers.PrimaryKeyRelatedField(queryset=Artist.objects.all(), source='artist', write_only=True)

    class Meta:
        model = Song
        fields = ['id', 'title', 'artist', 'artist_id', 'genre', 'audio', 'song_cover_url', 'user']
        read_only_fields = ['user']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        audio_file_path = instance.audio.path if instance.audio else None
        if audio_file_path:
            try:
                audio_info = mediainfo(audio_file_path)
                duration_seconds = float(audio_info['duration'])
                hours = int(duration_seconds // 3600)
                minutes = int((duration_seconds % 3600) // 60)
                seconds = int(duration_seconds % 60)
                duration_formatted = f"{hours:02}:{minutes:02}:{seconds:02}"
                representation['duration'] = duration_formatted
            except Exception as e:
                representation['duration'] = "00:00:00"
                print(f"Error retrieving duration: {e}")
        else:
            representation['duration'] = "00:00:00"

        return representation


class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)
    songs_id = serializers.PrimaryKeyRelatedField(queryset=Song.objects.all(), many=True, write_only=True, required=False)

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'user', 'songs','cover_image', 'songs_id', 'is_public', 'created_at']

    def create(self, validated_data):
        song_ids = validated_data.pop('songs_id', [])
        playlist = Playlist.objects.create(**validated_data)
        if song_ids:
            playlist.songs.set(song_ids)
        return playlist

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.is_public = validated_data.get('is_public', instance.is_public)
        song_ids = validated_data.get('songs_id', [])
        if song_ids:
            instance.songs.set(song_ids)
        instance.save()
        return instance


class AlbumSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)
    artist = ArtistSerializer(read_only=True)
    artist_id = serializers.PrimaryKeyRelatedField(queryset=Artist.objects.all(), source='artist', write_only=True)

    class Meta:
        model = Album
        fields = ['id', 'name', 'artist', 'artist_id', 'release_date', 'songs', 'cover_image_url']


class LikeSerializer(serializers.ModelSerializer):
    user=UserProfileSerializer(read_only=True)
    song = SongSerializer(read_only=True)
    class Meta:
        model = Like
        fields = ['id', 'user', 'song', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    songs = SongSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'song', 'songs', 'content', 'created_at']


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'user', 'artist', 'created_at']
        read_only_fields = ['user']


class PlaylistCollaboratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaylistCollaborator
        fields = ['id', 'playlist', 'user', 'role']


class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id', 'title', 'song_cover_url', 'audio']


class RecentlyPlayedSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecentlyPlayed
        fields = ['id', 'song_title', 'artist_name', 'image_url', 'played_at']