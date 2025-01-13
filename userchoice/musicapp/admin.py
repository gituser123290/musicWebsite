from django.contrib import admin
from .models import Album,Artist,Song,Playlist,PlaylistCollaborator,Like,Subscription,Comment

# Register your models here.
admin.site.register(Album)
admin.site.register(Artist)
admin.site.register(Song)
admin.site.register(Playlist)
admin.site.register(PlaylistCollaborator)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Subscription)