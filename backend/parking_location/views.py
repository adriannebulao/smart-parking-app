from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated

from .models import ParkingLocation
from .serializers import ParkingLocationSerializer
from .permissions import IsAdminOrReadOnly


class ParkingLocationViewSet(viewsets.ModelViewSet):
    queryset = ParkingLocation.objects.all()
    serializer_class = ParkingLocationSerializer
    permission_classes = (IsAuthenticated, IsAdminOrReadOnly)

    filter_backends = (DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)

    filterset_fields = {'slots'}

    search_fields = ['name']

    ordering_fields = ['id', 'name', 'slots', 'created_at', 'updated_at']
    ordering = ['id']