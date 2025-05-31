from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import ParkingLocation
from .serializers import ParkingLocationSerializer
from .permissions import IsAdminOrReadOnly


class ParkingLocationViewSet(viewsets.ModelViewSet):
    queryset = ParkingLocation.objects.all()
    serializer_class = ParkingLocationSerializer
    permission_classes = (IsAuthenticated, IsAdminOrReadOnly)