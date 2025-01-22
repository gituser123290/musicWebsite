from rest_framework import permissions


class IsAdminOrReadOnly(permissions.IsAdminUser):
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return bool(request.user and request.user.is_staff)

        # We can do also in this way
        # admin_permission = bool(request.user and request.user.is_superuser)
        
        # return request.method =='GET' or admin_permission
    

class IsReviewUserOrReadOnly(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        # we can do this as it
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return obj.review_user == request.user or obj.review_user.is_staff
            # return bool(request.user and request.user)
        
        # and We also can do it this way
        
        # owner_permission = bool(request.user and request.user)
        
        # return request.method in ['GET', 'PUT', 'DELETE'] or owner_permission