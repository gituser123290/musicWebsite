from django.urls import path
from .views import *

urlpatterns = [
    
    path('search/', SearchAPIView.as_view(), name='album-list'),
    path('recently-played/', RecentlyPlayedView.as_view(), name='recently-played'),
    # Song URLs
    path('songs/', SongAPIView.as_view(), name='song-list'),
    path('songs/<int:song_id>/', SongAPIView.as_view(), name='song-detail'),

    # Playlist URLs
    path('playlists/', PlaylistListAPIView.as_view(), name='playlist-list'),
    path('playlists/create/', PlaylistCreateAPIView.as_view(), name='playlist-create'),
    path('playlists/<int:pk>/add-song/', PlaylistUpdateAPIView.as_view(), name='playlist-update'),
    path('playlists/<int:pk>/delete/', PlaylistDeleteAPIView.as_view(), name='playlist-delete'),
    path('playlists/<int:playlist_id>/songs/<int:song_id>/', PlaylistDestroyAPIView.as_view(), name='playlist-delete'),

    path('liked/', LikedSongs.as_view(), name='liked-songs'),
    # Album URLs
    path('albums/', AlbumAPIView.as_view(), name='album-list-create'),
    path('albums/<int:album_id>/', AlbumAPIView.as_view(), name='album-detail'),

    # Artist URLs
    path('artists/', ArtistListAPIView.as_view(), name='artist-list'),
    path('artist/create/', ArtistCreateAPIView.as_view(), name='artist-create'),
    path('artists/<int:pk>/', ArtistRetrieveUpdateDestroyAPIView.as_view(), name='artist-detail'),

    # Like URLs
    path('songs/<int:song_id>/like/', LikeAPIView.as_view(), name='like-api'),
    # Comment URLs
    path('songs/<int:song_id>/comments/', CommentAPIView.as_view(), name='comment-list-create'),
    path('songs/<int:song_id>/comments/<int:comment_id>/', CommentAPIView.as_view(), name='comment-detail'),

    # Subscription URLs
    path('subscriptions/', SubscriptionListCreateAPIView.as_view(), name='subscription-list-create'),
    path('subscriptions/<int:pk>/', SubscriptionRetrieveUpdateDestroyAPIView.as_view(), name='subscription-detail'),

    # Playlist Collaborator URLs
    path('playlist_collaborators/', PlaylistCollaboratorListCreateAPIView.as_view(), name='playlist-collaborator-list-create'),
    path('playlist_collaborators/<int:pk>/', PlaylistCollaboratorRetrieveUpdateDestroyAPIView.as_view(), name='playlist-collaborator-detail'),

    # Audio Files URLs
    path('audio_files/', AudioFiles.as_view(), name='audio-files'),

    # External API User URLs
    path('users/', UserApiView.as_view(), name='users'),
    path('users/<int:id>/', UserDetailView.as_view(), name='user-detail'),

    # External API Product URLs
    path('products/', ProductApi.as_view(), name='products'),
    path('products/<int:id>/', ProductDetailView.as_view(), name='product-detail'),
]