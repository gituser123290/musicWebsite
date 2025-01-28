from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserProfile
# from musicapp.serializers import PlaylistSerializer
from musicapp.models import Playlist,Song

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True)

    class Meta:
        model = get_user_model()
        fields = ['username',  'email','password', 'confirmPassword']

    def validate(self, data):
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirmPassword')  
        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email'),
        )
        return user
    
class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ['id', 'title', 'artist']

class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True)

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'songs', 'user']


class UserProfileSerializer(serializers.ModelSerializer):
    playlists = PlaylistSerializer(many=True)
    class Meta:
        model = get_user_model()
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email', 
            'profile_picture','playlists', 'bio', 'phone_number', 'date_joined','last_login'
        ]
    # def get_playlists(self, obj):
    #     return PlaylistSerializer(Playlist.objects.filter(user=obj), many=True).data

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['profile_picture', 'bio', 'phone_number']
    
    def update(self, instance, validated_data):
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.save()
        return instance
