
from django.urls import reverse,path
from .views import AuthorAPIView,AuthorDetailAPIView


urlpatterns=[
    # path('',views.books,name='book_list'),
    # path('authors/',views.authors,name='author_list'),
    # path('book/<int:pk>/',views.book_detail,name='book_detail'),
    # path('author/<int:pk>/',views.get_author,name='author_detail'),
    path('author/',AuthorAPIView.as_view(),name='authors'),
    path('author/<int:id>/detail/',AuthorDetailAPIView.as_view(),name='author-details'),
]