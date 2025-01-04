from django.db import models
import datetime

# Create your models here.

class Author(models.Model):
    name = models.CharField(max_length=100)
    birth_date = models.DateField()
    death_date = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=50)
    biography = models.TextField()
    image = models.ImageField(upload_to='authors/')
    website = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    def get_age(self):
        if self.death_date:
            return self.death_date.year - self.birth_date.year - ((self.death_date.month, self.death_date.day) < (self.birth_date.month, self.birth_date.day))
        else:
            today = datetime.date.today()
            return today.year - self.birth_date.year - ((today.month, today.day) < (self.birth_date.month, self.birth_date.day))
        
    def __str__(self):
        return f"{self.name}"
        
        
class Book(models.Model):
    title = models.CharField(max_length=200)
    publication_date = models.CharField(max_length=50)
    author = models.ForeignKey(Author, on_delete=models.CASCADE,related_name='books')
    genre = models.CharField(max_length=50)
    pages = models.PositiveIntegerField(default=0)
    description = models.TextField()
    cover_image = models.ImageField(upload_to='books/')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} By {self.author}"