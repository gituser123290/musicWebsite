from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from .serializers import RegisterSerializer,UserProfileSerializer,UserProfileUpdateSerializer
from django.contrib.auth import authenticate
from rest_framework import generics
from rest_framework.response import Response
from .models import UserProfile



@api_view(['POST'])
def logout_view(request):
    if request.user.is_authenticated:
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_401_UNAUTHORIZED)   

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()  # Save the new user

            # Create token for the newly created user
            token, created = Token.objects.get_or_create(user=user)

            return Response({
                "message": "User registered successfully",
                "user": serializer.data,
                "token": token.key  # Return the token to the client
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    

class UserProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        # Lazy import of the serializer to prevent circular import
        from authApp.serializers import UserProfileSerializer
        return UserProfileSerializer


