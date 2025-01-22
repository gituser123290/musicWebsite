from rest_framework import serializers
from rest_framework import serializers
from .models import CustomUser

class RegisterationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = CustomUser
        fields = ['email', 'username','bio', 'avatar', 'password','password2']
        extra_kwargs = {'password2': {'write_only': True}}
        
    def save(self):
        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        
        if password != password2:
            raise serializers.ValidationError("Passwords don't match.")
        
        if CustomUser.objects.filter(email=self.validated_data['email']).exists():  
            raise serializers.ValidationError("Email already exists.")
        
        user = CustomUser.objects.create_user(
            username=self.validated_data['username'],
            email=self.validated_data['email'],
            bio=self.validated_data['bio'],
            avatar=self.validated_data['avatar'],   
            password=password,  
        )
        user.save()
        return user

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'bio', 'avatar']
    
    