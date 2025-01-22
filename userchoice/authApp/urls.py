from rest_framework.authtoken.views import obtain_auth_token
from django.urls import path
from authApp.views import registration_view,logout_view,CustomUserView



urlpatterns =[
    path('login/', obtain_auth_token, name='login'),  
    path('register/',registration_view,name='register'),
    path('logout/',logout_view,name='logout'),
    path('user/',CustomUserView.as_view(),name='user'),
] 