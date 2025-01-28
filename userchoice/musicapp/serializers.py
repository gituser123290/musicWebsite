from rest_framework import serializers
from .models import Song, Playlist, Album, Artist, Like, Comment, Subscription, PlaylistCollaborator
from django.contrib.auth.models import User
from authApp.serializers import UserProfileSerializer
from pydub.utils import mediainfo


class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'
        
        
    # def validate(self, data):
    #     image = data.get('image')
    #     image_url = data.get('image_url')

    #     if not image and not image_url:
    #         raise serializers.ValidationError("At least one image field (image or image_url) must be provided.")

    #     if image and image_url:
    #         raise serializers.ValidationError("Only one image field should be provided: either 'image' or 'image_url'.")

    #     return data

        
        
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
        
    # def validate(self, data):
    #     if not data.get('song_cover') and not data.get('song_cover_url'):
    #         raise serializers.ValidationError("At least one image field must be provided: song_cover or song_cover_url.")

    #     if data.get('song_cover') and data.get('song_cover_url'):
    #         raise serializers.ValidationError("Only one image field should be provided: either 'song_cover' or 'song_cover_url', not both.")
    #     if data.get('song_cover') and not data.get('song_cover_url'):
    #         return data
    #     if data.get('song_cover_url') and not data.get('song_cover'):
    #         return data
    #     return data
    
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
    user = serializers.PrimaryKeyRelatedField(read_only=True) 

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'user', 'songs', 'songs_id', 'is_public', 'created_at']

    def create(self, validated_data):

        # song_id = validated_data.pop('songs_id', song_id)
        
        song_id = validated_data.get('songs_id',[])

        playlist = Playlist.objects.create(**validated_data)

        if song_id:
            songs = Song.objects.filter(id__in=song_id)
            playlist.songs.set(songs)

        return playlist

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.user = validated_data.get('user', instance.user)
        instance.is_public = validated_data.get('is_public', instance.is_public)
        
        song_id = validated_data.get('songs_id',[])

        songs = Song.objects.filter(id__in=song_id)
        instance.songs.set(songs) 

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
    user=UserProfileSerializer(read_only=True)
    class Meta:
        model = Like
        fields = ['id', 'user', 'song', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    user=UserProfileSerializer(read_only=True)
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
        fields = ['id','title','song_cover_url','audio']
