from django.shortcuts import get_object_or_404, render
from .models import Book,Author

# Create your views here.

def authors(request):
    authors = Author.objects.all()
    # books = Book.objects.filter(author=author)
    return render(request, 'books/author_list.html', {'authors': authors})

def get_author(request,pk):
    author = Author.objects.get(id=pk)
    books = Book.objects.filter(author=author).all()
    return render(request, 'books/author_detail.html', {'author': author, 'books': books})


def books(request):
    books = Book.objects.all()
    return render(request, 'books/book_list.html', {'books': books})

def book_detail(request,pk):
    book = get_object_or_404(Book, pk=pk)
    author = book.author  # Assuming a one-to-one relationship between Book and Author. Adjust as needed.
    return render(request, 'books/book_detail.html', {'book': book,'author':author})
