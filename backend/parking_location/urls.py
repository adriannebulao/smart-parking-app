from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ParkingLocationViewSet


router = DefaultRouter()
router.register('parking_locations', ParkingLocationViewSet, basename='parking_location')

urlpatterns = [
    path('', include(router.urls)),
]