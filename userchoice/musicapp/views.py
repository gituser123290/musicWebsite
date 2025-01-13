from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework import status

from .models import Song, Playlist, Album, Artist, Like, Comment, Subscription, PlaylistCollaborator
from .serializers import SongSerializer, PlaylistSerializer, AlbumSerializer, ArtistSerializer, LikeSerializer, CommentSerializer, SubscriptionSerializer, PlaylistCollaboratorSerializer

# Song View (List and Create)
class SongListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = SongSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Song.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        title = serializer.validated_data.get('title')
        if Song.objects.filter(user=self.request.user, title=title).exists():
            raise ValidationError("A song with this title already exists.")
        
        serializer.save(user=self.request.user)

# Song View (Retrieve, Update, and Delete)
class SongRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SongSerializer
    permission_classes = [IsAuthenticated]
    queryset = Song.objects.all()

# Playlist View (List and Create)
class PlaylistListCreateAPIView(generics.CreateAPIView):
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
    permission_classes = [IsAuthenticated]
    queryset = PlaylistCollaborator.objects.all()


