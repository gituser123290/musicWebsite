# Generated by Django 5.1.4 on 2025-02-03 08:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authApp', '0002_alter_userprofile_groups_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userprofile',
            old_name='profile_picture',
            new_name='user_picture',
        ),
    ]
