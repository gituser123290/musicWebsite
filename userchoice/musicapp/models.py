from django.db import models
from django.contrib.auth.models import User

class Song(models.Model):
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    genre = models.CharField(max_length=100)
    duration = models.DurationField()  
    file = models.FileField(upload_to='songs/')  
    user = models.ForeignKey(User, related_name='songs', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.artist}"

class Playlist(models.Model):
    name = models.CharField(max_length=200)
    user = models.ForeignKey(User, related_name='playlists', on_delete=models.CASCADE)
    songs = models.ManyToManyField(Song, related_name='playlists')
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Album(models.Model):
    name = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    release_date = models.DateField()
    songs = models.ManyToManyField(Song, related_name='albums')
    cover_image = models.ImageField(upload_to='album_covers/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} by {self.artist}"

class Artist(models.Model):
    name = models.CharField(max_length=200)
    bio = models.TextField(blank=True, null=True)
    image=models.ImageField(upload_to="artist_image/",blank=True,null=True)
    website = models.URLField(blank=True, null=True)
    social_media = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.name

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'song']

    def __str__(self):
        return f"{self.user.username} liked {self.song.title}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.song.title}"

class Subscription(models.Model):
    user = models.ForeignKey(User, related_name='subscriptions', on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, related_name='subscribers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} subscribed to {self.artist.name}"

class PlaylistCollaborator(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=[('owner', 'Owner'), ('collaborator', 'Collaborator')])

    def __str__(self):
        return f"{self.user.username} is a {self.role} of {self.playlist.name}"
