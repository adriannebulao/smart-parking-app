from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status, mixins, filters
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from rest_framework.response import Response

from .models import Reservation
from .serializers import ReservationSerializer
from .permissions import IsAdminOrOwner


class ReservationViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = ReservationSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdminOrOwner)
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['id', 'start_time', 'end_time', 'created_at', 'updated_at', 'user', 'parking_location', 'is_cancelled']
    filterset_fields = ['id', 'start_time', 'end_time', 'created_at', 'updated_at', 'user', 'parking_location',
                       'is_cancelled']
    search_fields = ['user__username', 'parking_location__name']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Reservation.objects.all()
        return Reservation.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        reservation = self.get_object()
        now = timezone.now()

        if not request.user.is_staff and reservation.start_time <= now:
            raise PermissionDenied("You cannot cancel a reservation after it has started.")

        if reservation.is_cancelled:
            return Response({'detail': 'Reservation is already cancelled.'}, status=status.HTTP_400_BAD_REQUEST)

        reservation.cancel()
        return Response({'detail': 'Reservation cancelled successfully.'}, status=status.HTTP_200_OK)