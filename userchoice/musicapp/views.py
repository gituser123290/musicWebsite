from django.shortcuts import render
from django.db.models import Max
from .models import Album,Artist,Song
# Create your views here.

def get_music(request):
    music_list =Song.objects.all()
    return render(request, 'music_app/music.html', {'music_list': music_list})


def get_artist(request):
    artist_list = Artist.objects.all()
    return render(request, 'music_app/artist.html', {'artist_list': artist_list})


def get_popularSong(request):
    max_popularity = Song.objects.aggregate(Max('popularity'))['popularity__max']
    
    if max_popularity is None:
        popular_songs = Song.objects.none()
    else:
        threshold = max_popularity / 2
        all_songs = Song.objects.all()
        popular_songs = []
        for song in all_songs:
            popularity_score = song.calculate_popularity()
            if popularity_score >= threshold:
                popular_songs.append(song)
        popular_songs.sort(key=lambda song: song.calculate_popularity(), reverse=True)
    return render(request, 'music_app/popular_song.html', {'popular_songs': popular_songs})

def get_mostPopularSongs(request):
    songs = Song.objects.all()
    count=songs.count()
    song_popularity = []
    for song in songs:
        score = song.calculate_popularity()
        song_popularity.append((song, score))
    sorted_songs = sorted(song_popularity, key=lambda x: x[1], reverse=True)
    top_songs = sorted_songs[:10]
    return render(request, 'music_app/most_popular_song.html', {'top_songs': top_songs,'count': count})