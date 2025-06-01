from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AdminUserViewSet, CreateUserView, UserProfileView, MyTokenObtainPairView, MyTokenRefreshView

router = DefaultRouter()
router.register('admin/manage-users', AdminUserViewSet, basename='manage-users')

non_viewset_urls = [
    path('users/register/', CreateUserView.as_view(), name='user_register'),
    path('users/login/', MyTokenObtainPairView.as_view(), name='user_login'),
    path('token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('users/profile/', UserProfileView.as_view(), name='user_profile'),
]
urlpatterns = [
    path('', include(router.urls)),
    *non_viewset_urls,
]