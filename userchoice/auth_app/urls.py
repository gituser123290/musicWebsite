from rest_framework.authtoken.views import obtain_auth_token
from django.urls import path
from auth_app.views import registration_view,logout_view


urlpatterns =[
    path('login/', obtain_auth_token, name='login'),  # for token authentication
    path('register/',registration_view,name='register'),
    path('logout/',logout_view,name='logout'),
    
    
] 