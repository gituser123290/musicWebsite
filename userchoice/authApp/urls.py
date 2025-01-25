from rest_framework.authtoken.views import obtain_auth_token
from django.urls import path
from authApp.views import RegisterView,UserProfileView



urlpatterns =[
    path('login/', obtain_auth_token, name='login'),  
    path('register/',RegisterView.as_view(),name='register'),
    path('user/',UserProfileView.as_view(),name='user'),
] 