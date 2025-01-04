from django.db import models
import os
# Define Album Model
class Album(models.Model):
    ALBUM_TYPE = (
        ('Pop', 'Pop'),
        ('Jazz', 'Jazz'),
        ('Rock', 'Rock'),
        ('Hip-Hop', 'Hip-Hop'),
        ('Electronic', 'Electronic'),
        ('Mixed', 'Mixed'),
        ('Other', 'Other'),
    )
    title = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    year = models.CharField(max_length=10)
    release_date = models.DateField()
    genre = models.CharField(max_length=50, choices=ALBUM_TYPE)
    no_of_songs = models.PositiveIntegerField(default=10)
    image = models.ImageField(upload_to='albums/',null=True, blank=True)
    
    def __str__(self):
        return self.artist
    
    class Meta:
        verbose_name_plural = 'Albums'
        ordering = ['-release_date']

class Artist(models.Model):
    ARTIST_GENRE = (
        ('Pop', 'Pop'),
        ('Rock', 'Rock'),
        ('Hip-Hop', 'Hip-Hop'),
        ('Jazz', 'Jazz'),
        ('Electronic', 'Electronic'),
        ('Other', 'Other'),
    )
    name = models.CharField(max_length=100)
    genre = models.CharField(max_length=50, choices=ARTIST_GENRE)
    birth_date = models.DateField()
    nationality = models.CharField(max_length=50)
    biography = models.TextField()
    image = models.ImageField(upload_to='artists/',null=True, blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = 'Artists'
        ordering = ['birth_date']

class Song(models.Model):
    SONG_GENRE = (
        ('Pop', 'Pop'),
        ('Rock', 'Rock'),
        ('Hip-Hop', 'Hip-Hop'),
        ('Jazz', 'Jazz'),
        ('Electronic', 'Electronic'),
        ('Mixed', 'Mixed'),
        ('Other', 'Other'),
    )
    title = models.CharField(max_length=100)
    album = models.ForeignKey('Album', on_delete=models.CASCADE, related_name='songs')
    song_cover = models.ImageField(upload_to='song_covers/',null=True, blank=True)
    artist = models.ForeignKey('Artist', on_delete=models.CASCADE, related_name='songs')
    audio_file=models.FileField(upload_to='audio_files/',null=True, blank=True)
    no_of_listeners = models.PositiveBigIntegerField(default=0)
    streams = models.PositiveBigIntegerField(default=0)
    radio_airplay = models.PositiveIntegerField(default=0)
    downloads = models.PositiveBigIntegerField(default=0)
    social_media_mentions = models.PositiveBigIntegerField(default=0)
    duration = models.DurationField()
    genre = models.CharField(max_length=50, choices=SONG_GENRE)
    track_number = models.PositiveIntegerField()
    popularity = models.PositiveBigIntegerField(default=0)
    
    
    # def delete_old_files(self):
    #     if self.song_cover:
    #         if os.path.isfile(self.song_cover.path):
    #             os.remove(self.song_cover.path)
    #     if self.audio_file:
    #         if os.path.isfile(self.audio_file.path):
    #             os.remove(self.audio_file.path)

    # def save(self, *args, **kwargs):
    #     if self.pk:
    #         old_item = Song.objects.get(pk=self.pk)
    #         if old_item.song_cover != self.song_cover:
    #             old_item.delete_old_files()
    #         if old_item.audio_file != self.audio_file:
    #             old_item.delete_old_files()
    #     super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.title} by {self.artist.name}'

    def calculate_popularity(self):
        """
        Calculate the popularity score of the song based on various factors:
        listeners, streams, radio spins, downloads, social media mentions.
        """
        # Define weights for each factor
        w_listeners = 0.3
        w_streams = 0.25
        w_radio = 0.1
        w_downloads = 0.15
        w_social_media = 0.2

        # Calculate the popularity score by multiplying each factor by its weight
        popularity_score = (
            (w_listeners * self.no_of_listeners) +
            (w_streams * self.streams) +
            (w_radio * self.radio_airplay) +
            (w_downloads * self.downloads) +
            (w_social_media * self.social_media_mentions)
        )
        self.popularity = popularity_score
        self.save()

        return popularity_score


    class Meta:
        verbose_name_plural = 'Songs'  
        ordering = ['title']  
