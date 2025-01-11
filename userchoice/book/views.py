# from django.shortcuts import get_object_or_404, render
# from .models import Book,Author

# # Create your views here.

# def authors(request):
#     authors = Author.objects.all()
#     # books = Book.objects.filter(author=author)
#     return render(request, 'books/author_list.html', {'authors': authors})

# def get_author(request,pk):
#     author = Author.objects.get(id=pk)
#     books = Book.objects.filter(author=author).all()
#     return render(request, 'books/author_detail.html', {'author': author, 'books': books})


# def books(request):
#     books = Book.objects.all()
#     return render(request, 'books/book_list.html', {'books': books})

# def book_detail(request,pk):
#     book = get_object_or_404(Book, pk=pk)
#     author = book.author  # Assuming a one-to-one relationship between Book and Author. Adjust as needed.
#     return render(request, 'books/book_detail.html', {'book': book,'author':author})


from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly,AllowAny,IsAuthenticated,IsAdminUser
# from rest_framework.generics import ListCreateAPIView,ListAPIView,UpdateAPIView,RetrieveUpdateDestroyAPIView
from rest_framework import generics
from rest_framework import status
from .models import Book,Author
from .serializers import AuthorSerializer
from rest_framework import filters


class AuthorAPIView(generics.ListCreateAPIView):
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    # permission_classes = [IsAuthenticatedOrReadOnly,AllowAny]
    # ordering_fields=['name','nationality']
    search_fields = ['name']
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    
    def perform_create(self, serializer):
        # Custom validation
        if serializer.validated_data.get('name') and len(serializer.validated_data['name']) < 3:
            raise ValueError("Author name must be at least 3 characters long")
        serializer.save()

    # for filtering         
    # def get_queryset(self):
    #     queryset = Author.objects.all()
    #     name = self.request.query_params.get('name', None)
    #     if name:
    #         queryset = queryset.filter(name=name)
    #     return queryset


class AuthorDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    # permission_classes = [IsAuthenticated]
    queryset=Author.objects.all()
    serializer_class=AuthorSerializer
    lookup_field='id'


# class AuthorDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Author.objects.all()
#     serializer_class = AuthorSerializer
#     lookup_field = 'id'

#     # Override GET method
#     def get(self, request, *args, **kwargs):
#         # Custom logic before retrieving the object
#         author = self.get_object()  # Get the author instance based on the 'id' lookup field
#         # You could log or manipulate data here if needed
#         serializer = self.get_serializer(author)
#         return Response(serializer.data)

#     # Override PUT method
#     def put(self, request, *args, **kwargs):
#         # Custom logic before updating the object
#         author = self.get_object()
#         serializer = self.get_serializer(author, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     # Override PATCH method (for partial updates)
#     def patch(self, request, *args, **kwargs):
#         # Custom logic before partially updating the object
#         author = self.get_object()
#         serializer = self.get_serializer(author, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     # Override DELETE method
#     def delete(self, request, *args, **kwargs):
#         # Custom logic before deleting the object
#         author = self.get_object()
#         # You could perform additional actions before deletion here (e.g., logging, archiving, etc.)
#         author.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)




