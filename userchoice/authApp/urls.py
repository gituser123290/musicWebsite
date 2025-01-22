from rest_framework.authtoken.views import obtain_auth_token
from django.urls import path
from authApp.views import registration_view,logout_view,CurrentUserView


urlpatterns =[
    path('login/', obtain_auth_token, name='login'),  # for token authentication
    path('register/',registration_view,name='register'),
    path('logout/',logout_view,name='logout'),
    path('user/',CurrentUserView.as_view(),name='user'),
    
    
] 