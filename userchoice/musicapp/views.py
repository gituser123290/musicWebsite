import requests
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly,AllowAny
from rest_framework.exceptions import ValidationError,NotFound
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response


from .models import Song, Playlist, Album, Artist, Like, Comment, Subscription, PlaylistCollaborator
from .serializers import SongSerializer,AudioSerializer, PlaylistSerializer, AlbumSerializer, ArtistSerializer, LikeSerializer, CommentSerializer, SubscriptionSerializer, PlaylistCollaboratorSerializer

# Song View (List and Create)
class SongListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = SongSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # return Song.objects.filter(user=self.request.user)
        return Song.objects.all()
    
    def perform_create(self, serializer):
        title = serializer.validated_data.get('title')
        if Song.objects.filter(user=self.request.user, title=title).exists():
            raise ValidationError("A song with this title already exists.")
 
        serializer.save(user=self.request.user)

# Song View (Retrieve, Update, and Delete)
class SongRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SongSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Song.objects.all()

# Playlist View (List and Create)
class PlaylistListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Playlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Playlist View (Retrieve, Update, and Delete)
class PlaylistRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated]
    queryset = Playlist.objects.all()

# Album View (List and Create)
class AlbumListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = AlbumSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Album.objects.all()

    def perform_create(self, serializer):
        serializer.save()

# Album View (Retrieve, Update, and Delete)
class AlbumRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AlbumSerializer
    permission_classes = [IsAuthenticated]
    queryset = Album.objects.all()

# Artist View (List and Create)
class ArtistListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ArtistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Artist.objects.all()

    def perform_create(self, serializer):
        
        serializer.save()

# Artist View (Retrieve, Update, and Delete)
class ArtistRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ArtistSerializer
    permission_classes = [IsAuthenticated]
    queryset = Artist.objects.all()

# Like View (List and Create)
class LikeListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Like.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Like View (Retrieve, Update, and Delete)
class LikeRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]
    queryset = Like.objects.all()

# Comment View (List and Create)
class CommentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Comment View (Retrieve, Update, and Delete)
class CommentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Comment.objects.all()

# Subscription View (List and Create)
class SubscriptionListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Subscription View (Retrieve, Update, and Delete)
class SubscriptionRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]
    queryset = Subscription.objects.all()

# PlaylistCollaborator View (List and Create)
class PlaylistCollaboratorListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PlaylistCollaboratorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PlaylistCollaborator.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# PlaylistCollaborator View (Retrieve, Update, and Delete)
class PlaylistCollaboratorRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PlaylistCollaboratorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = PlaylistCollaborator.objects.all()

class AudioFiles(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request):
        songs = Song.objects.all()
        serializer = AudioSerializer(songs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

        
        
        

FREEE_API_URL = 'https://api.escuelajs.co/api/v1/users'

class UserApiView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request):
        try:
            response = requests.get(FREEE_API_URL)
            if response.status_code == 200:
                users_data = response.json()
                return Response(users_data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Failed to fetch users data from Freee API"},
                    status=response.status_code,
                )
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class UserDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request,id):
        try:
            response = requests.get(f"{FREEE_API_URL}/{id}")
            if response.status_code == 200:
                user_data = response.json()
                return Response(user_data, status=status.HTTP_200_OK)
            elif response.status_code == 404:
                raise NotFound(detail="User not found.")
            else:
                return Response(
                    {"error": "Failed to fetch user data from Freee API"},
                    status=response.status_code,
                )
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class ProductApi(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request):
        try:
            url='https://api.escuelajs.co/api/v1/products'
            response=requests.get(url)
            if response.status_code==200:
                products=response.json()
                return Response(products,status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Failed to fetch products data from Freee API"},
                    status=response.status_code,
                )
        except requests.exceptions.RequestException as e:
            return Response(
                {"error":f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class ProductDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get(self, request,id):
        try:
            url='https://api.escuelajs.co/api/v1/products'
            response = requests.get(f"{url}/{id}")
            if response.status_code == 200:
                user_data = response.json()
                return Response(user_data, status=status.HTTP_200_OK)
            elif response.status_code == 404:
                raise NotFound(detail="User not found.")
            else:
                return Response(
                    {"error": "Failed to fetch user data from Freee API"},
                    status=response.status_code,
                )
        except requests.exceptions.RequestException as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )



