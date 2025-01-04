
from django.urls import path
# from . import views
from .apiViews import (AlbumList,AlbumDetail,ArtistList,ArtistDetail,
                       SongList,SongDetail,AudioFileListView,PopularSoung,UserApiView,ProductApi,ProductDetailView,UserDetailView
                       
                       )

# urlpatterns =[
#     path('songs/',views.get_music,name="music"),
#     path('artist/',views.get_artist,name="artists"),
#     path('popular/',views.get_popularSong,name="populars"),
#     path('mostpopular/',views.get_mostPopularSongs,name="most_populars"),
# ]

urlpatterns = [
    path("album/", AlbumList.as_view(), name="album_list"),
    path("album/<int:pk>/", AlbumDetail.as_view(), name="albums_detail"),
    path("artist/", ArtistList.as_view(), name="artist_list"),
    path("artist/<int:pk>/", ArtistDetail.as_view(), name="artists_detail"),
    path("song/", SongList.as_view(), name="song_list"),
    path("song/<int:pk>/", SongDetail.as_view(), name="song_detail"),
    path("songs/", AudioFileListView.as_view(), name="song-list"),
    path('popularity/', PopularSoung.as_view(), name='popular_song'),
    path('users/',UserApiView.as_view(), name='users'),
    path('users/<int:id>/',UserDetailView.as_view(), name='users_detail'),
    path('product/',ProductApi.as_view(), name='products'),
    path('product/<int:id>/',ProductDetailView.as_view(), name='product-detail'),
]
