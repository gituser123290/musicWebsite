
from django.urls import reverse,path
from . import views


urlpatterns=[
    path('',views.books,name='book_list'),
    path('authors/',views.authors,name='author_list'),
    path('book/<int:pk>/',views.book_detail,name='book_detail'),
    path('author/<int:pk>/',views.get_author,name='author_detail'),

]