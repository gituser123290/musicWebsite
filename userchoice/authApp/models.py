from django.db import models
from django.contrib.auth.models import AbstractUser,Permission,Group
from rest_framework.authtoken.models import Token
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(AbstractUser):
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    
    
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='userprofile_permissions',  # Adds unique reverse accessor for user_permissions
        blank=True
    )
    groups = models.ManyToManyField(
        Group,
        related_name='userprofile_groups',  # Adds unique reverse accessor for groups
        blank=True
    )

    def __str__(self):
        return self.username
    
    

# Signal to create the auth token when a user is created
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
