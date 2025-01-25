# users/serializers.py

from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    """Serializer for returning user profile data"""
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'profile_picture', 'bio', 'phone_number']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True)  # Ensure password is not returned in the response

    class Meta:
        model = get_user_model()
        fields = ['username', 'password', 'email', 'first_name', 'last_name', 'profile_picture', 'bio', 'phone_number']

    def create(self, validated_data):
        """Create a new user profile"""
        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email'),
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            profile_picture=validated_data.get('profile_picture'),
            bio=validated_data.get('bio'),
            phone_number=validated_data.get('phone_number')
        )
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['username','email', 'first_name', 'last_name', 'profile_picture', 'bio', 'phone_number','date_joined']