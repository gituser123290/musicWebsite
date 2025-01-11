
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Author,Book



class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Author
        fields='__all__'



