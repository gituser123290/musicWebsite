from django.urls import path
from . import views

urlpatterns = [
    # Song URLs
    path('songs/', views.SongListAPIView.as_view(), name='song-list'),
    path('songs/create/', views.SongCreateAPIView.as_view(), name='song-create'),
    path('songs/<int:pk>/', views.SongRetrieveUpdateDestroyAPIView.as_view(), name='song-detail'),

    # Playlist URLs
    path('playlist/', views.PlaylistListAPIView.as_view(), name='playlist-list'),
    path('playlist/create/', views.PlaylistCreateAPIView.as_view(), name='playlist-create'),
    path('playlist/<int:pk>/add_song/', views.PlaylistUpdateAPIView.as_view(), name='playlist-update'),
    path('playlists/<int:playlist_id>/songs/<int:song_id>/', views.PlaylistDestroyAPIView.as_view(), name='playlist-delete'),

    # Album URLs
    path('albums/', views.AlbumListAPIView.as_view(), name='album-list'),
    path('albums/create/', views.AlbumCreateAPIView.as_view(), name='album-create'),
    path('albums/<int:pk>/', views.AlbumUpdateAPIView.as_view(), name='album-update'),
    path('albums/delete/<int:pk>/', views.AlbumDeleteAPIView.as_view(), name='album-delete'),

    # Artist URLs
    path('artists/', views.ArtistListCreateAPIView.as_view(), name='artist-list-create'),
    path('artists/<int:pk>/', views.ArtistRetrieveUpdateDestroyAPIView.as_view(), name='artist-detail'),

    # Like URLs
    path('likes/<int:song_id>/', views.LikeListAPIView.as_view(), name='like-list'),
    path('like/<int:song_id>/', views.LikeCreateAPIView.as_view(), name='like-create'),
    path('like/<int:pk>/', views.LikeRetrieveUpdateDestroyAPIView.as_view(), name='like-detail'),

    # Comment URLs
    path('comments/<int:song_id>/', views.CommentListAPIView.as_view(), name='comment-list'),
    path('comment/<int:pk>/', views.CommentCreateAPIView.as_view(), name='comment-create'),
    path('comment/<int:pk>/', views.CommentRetrieveUpdateDestroyAPIView.as_view(), name='comment-detail'),

    # Subscription URLs
    path('subscriptions/', views.SubscriptionListCreateAPIView.as_view(), name='subscription-list-create'),
    path('subscriptions/<int:pk>/', views.SubscriptionRetrieveUpdateDestroyAPIView.as_view(), name='subscription-detail'),

    # Playlist Collaborator URLs
    path('playlist_collaborators/', views.PlaylistCollaboratorListCreateAPIView.as_view(), name='playlist-collaborator-list-create'),
    path('playlist_collaborators/<int:pk>/', views.PlaylistCollaboratorRetrieveUpdateDestroyAPIView.as_view(), name='playlist-collaborator-detail'),

    # Audio Files URLs
    path('audio_files/', views.AudioFiles.as_view(), name='audio-files'),

    # External API User URLs
    path('users/', views.UserApiView.as_view(), name='users'),
    path('users/<int:id>/', views.UserDetailView.as_view(), name='user-detail'),

    # External API Product URLs
    path('products/', views.ProductApi.as_view(), name='products'),
    path('products/<int:id>/', views.ProductDetailView.as_view(), name='product-detail'),
]
