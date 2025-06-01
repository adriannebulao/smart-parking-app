from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminUserViewSet


router = DefaultRouter()
router.register('admin/manage-users', AdminUserViewSet, basename='manage-users')
urlpatterns = [
    path('', include(router.urls)),
]