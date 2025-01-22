from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from .serializers import RegisterationSerializer,CustomUserSerializer



@api_view(['POST'])
def logout_view(request):
    if request.user.is_authenticated:
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_401_UNAUTHORIZED)   

@api_view(['POST'])
@permission_classes([AllowAny])
def registration_view(request):
    if request.method == 'POST':
        serializer = RegisterationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            data = {
                'response': "Successfully Registered",
                'username': user.username,
                'email': user.email,
                'bio': user.bio,
                'avatar': user.avatar,
                'token':Token.objects.get(user=user).key,
            }
            return Response(data, status=status.HTTP_201_CREATED)  
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomUserView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    
    def get(self, request):
        user = self.request.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data,status=status.HTTP_200_OK)

