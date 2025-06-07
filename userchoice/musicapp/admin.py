# from django.contrib import admin
# from .models import *
# # Register your models here.
# admin.site.register(Album)
# admin.site.register(Artist)
# admin.site.register(Song)
# admin.site.register(Playlist)
# admin.site.register(PlaylistCollaborator)
# admin.site.register(Comment)
# admin.site.register(Like)
# admin.site.register(Subscription)
# admin.site.register(SongComment)
# admin.site.register(PlaylistSong)
# Not manual, but useful for debugging purposes:
from django.apps import apps
from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered

app_models = apps.get_app_config('musicapp').get_models()

for model in app_models:
    try:
        admin.site.register(model)
    except AlreadyRegistered:
        pass
