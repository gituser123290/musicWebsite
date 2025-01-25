from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from .serializers import RegisterSerializer,UserProfileSerializer
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

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def registration_view(request):
#     if request.method == 'POST':
#         serializer = RegisterSerializer(data=request.data)
        
#         if serializer.is_valid():
#             user = serializer.save()
#             data = {
#                 'response': "Successfully Registered",
#                 'username': user.username,
#                 'email': user.email,
#                 'bio': user.bio,
#                 'avatar': user.avatar,
#                 'token':Token.objects.get(user=user).key,
#             }
#             return Response(data, status=status.HTTP_201_CREATED)  
        
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    def post(self, request):
        """ Handle user registration and return a token """
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()  # Save the new user profile

            # Create a token for the newly created user
            token, created = Token.objects.get_or_create(user=user)

            return Response({
                "message": "User registered successfully",
                "user": serializer.data,
                "token": token.key  # Return the token to the client
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class LoginUserView(APIView):
#     permission_classes = [permissions.AllowAny]

#     def post(self, request):
#         """ Handle user login and return token """
#         username = request.data.get("username")
#         password = request.data.get("password")
        
#         user = authenticate(username=username, password=password)
        
#         if user is not None:
#             # If authentication is successful, return the token
#             token, created = Token.objects.get_or_create(user=user)
#             return Response({
#                 "message": "Login successful",
#                 "token": token.key
#             }, status=status.HTTP_200_OK)
        
#         return Response({
#             "error": "Invalid credentials"
#         }, status=status.HTTP_400_BAD_REQUEST)

# users/views.py

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Directly get the user profile via the authenticated user
        return self.request.user

