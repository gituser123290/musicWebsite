from django.urls import path, include
from .views import SongListCreateAPIView, SongRetrieveUpdateDestroyAPIView, PlaylistListCreateAPIView, PlaylistRetrieveUpdateDestroyAPIView, \
    AlbumListCreateAPIView, AlbumRetrieveUpdateDestroyAPIView, ArtistListCreateAPIView, ArtistRetrieveUpdateDestroyAPIView, \
    LikeListCreateAPIView, LikeRetrieveUpdateDestroyAPIView, CommentListCreateAPIView, CommentRetrieveUpdateDestroyAPIView, \
    SubscriptionListCreateAPIView, SubscriptionRetrieveUpdateDestroyAPIView, PlaylistCollaboratorListCreateAPIView, PlaylistCollaboratorRetrieveUpdateDestroyAPIView
    
    
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('songs/', SongListCreateAPIView.as_view(), name='song-list-create'),
    path('songs/<int:pk>/', SongRetrieveUpdateDestroyAPIView.as_view(), name='song-retrieve-update-destroy'),
    
    path('playlists/', PlaylistListCreateAPIView.as_view(), name='playlist-list-create'),
    path('playlists/<int:pk>/', PlaylistRetrieveUpdateDestroyAPIView.as_view(), name='playlist-retrieve-update-destroy'),
    
    path('albums/', AlbumListCreateAPIView.as_view(), name='album-list-create'),
    path('albums/<int:pk>/', AlbumRetrieveUpdateDestroyAPIView.as_view(), name='album-retrieve-update-destroy'),
    
    path('artists/', ArtistListCreateAPIView.as_view(), name='artist-list-create'),
    path('artists/<int:pk>/', ArtistRetrieveUpdateDestroyAPIView.as_view(), name='artist-retrieve-update-destroy'),
    
    path('likes/', LikeListCreateAPIView.as_view(), name='like-list-create'),
    path('likes/<int:pk>/', LikeRetrieveUpdateDestroyAPIView.as_view(), name='like-retrieve-update-destroy'),
    
    path('comments/', CommentListCreateAPIView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', CommentRetrieveUpdateDestroyAPIView.as_view(), name='comment-retrieve-update-destroy'),
    
    path('subscriptions/', SubscriptionListCreateAPIView.as_view(), name='subscription-list-create'),
    path('subscriptions/<int:pk>/', SubscriptionRetrieveUpdateDestroyAPIView.as_view(), name='subscription-retrieve-update-destroy'),
    
    path('playlist_collaborators/', PlaylistCollaboratorListCreateAPIView.as_view(), name='playlist-collaborator-list-create'),
    path('playlist_collaborators/<int:pk>/', PlaylistCollaboratorRetrieveUpdateDestroyAPIView.as_view(), name='playlist-collaborator-retrieve-update-destroy'),
]
