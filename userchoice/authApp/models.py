from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance) 
        
        
class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio=models.CharField(max_length=100, blank=True,null=True)
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',  # Use a custom related name to avoid conflict
        blank=True,
    )
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',  # Use a custom related name to avoid conflict
        blank=True,
    )