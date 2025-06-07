from django.db import models
from django.conf import settings

# User=settings.AUTH_USER_MODEL

class Song(models.Model):
    title = models.CharField(max_length=200,blank=True, null=True)
    artist = models.ForeignKey('Artist', on_delete=models.CASCADE, related_name='artists')
    genre = models.CharField(max_length=100,blank=True, null=True) 
    audio = models.FileField(upload_to='songs/', null=True, blank=True)  
    duration = models.FloatField(null=True, blank=True)
    song_cover_url = models.URLField(max_length=500, blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='songs', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.artist}"

class Playlist(models.Model):
    name = models.CharField(max_length=200,blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='playlists', on_delete=models.CASCADE)
    songs = models.ManyToManyField(Song, related_name='playlists')
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s {self.name}"


class Album(models.Model):
    name = models.CharField(max_length=200,blank=True, null=True)
    artist = models.ForeignKey('Artist',on_delete=models.CASCADE,related_name='artist')
    release_date = models.DateField()
    songs = models.ManyToManyField(Song, related_name='albums')
    cover_image_url = models.URLField(max_length=500,blank=True, null=True)

    def __str__(self):
        return f"{self.name} by {self.artist}"

class Artist(models.Model):
    name = models.CharField(max_length=200,blank=True, null=True)
    bio = models.TextField(max_length=250,blank=True, null=True)
    image_url = models.URLField(max_length=500,blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    social_media = models.JSONField(blank=True, null=True)
    nationality=models.CharField(max_length=100,null=True,blank=True)

    def __str__(self):
        return f"{self.name}"

class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'song']

    def __str__(self):
        return f"{self.user.username} liked {self.song.title}"

class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.song.title}"

class Subscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='subscriptions', on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, related_name='subscribers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} subscribed to {self.artist.name}"

class PlaylistCollaborator(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=[('owner', 'Owner'), ('collaborator', 'Collaborator')])

    def __str__(self):
        return f"{self.user.username} is a {self.role} of {self.playlist.name}"
    
    
    
class RecentlyPlayed(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="recently_played")
    song_title = models.CharField(max_length=255)
    artist_name = models.CharField(max_length=255, blank=True)
    image_url = models.URLField(blank=True)
    played_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.song_title} by {self.artist_name}"