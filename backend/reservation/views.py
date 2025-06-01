from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions, mixins, filters, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.utils import timezone
from rest_framework.response import Response

from .models import Reservation
from .serializers import ReservationSerializer
from .permissions import IsAdminOrOwner
from .services.summary import (
    summary_today,
    summary_grouped,
    summary_total,
    get_time_filters,
    apply_time_filters,
    get_date_range,
    validate_summary_params,
    apply_date_range_filters,
)

@extend_schema(tags=['Reservations'])
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
        queryset = Reservation.objects.all() if user.is_staff else Reservation.objects.filter(user=user)

        status_param = self.request.query_params.get('status')
        now = timezone.now()

        if status_param == 'upcoming':
            queryset = queryset.filter(end_time__gt=now, is_cancelled=False)
        elif status_param == 'completed':
            queryset = queryset.filter(end_time__lte=now, is_cancelled=False)
        elif status_param == 'cancelled':
            queryset = queryset.filter(is_cancelled=True)
        elif status_param == 'active':
            queryset = queryset.filter(start_time__lte=now, end_time__gte=now, is_cancelled=False)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        reservation = self.get_object()
        now = timezone.now()

        if not request.user.is_staff and reservation.start_time <= now:
            raise ValidationError("You cannot cancel a reservation after it has started.")

        if reservation.is_cancelled:
            return Response({'detail': 'Reservation is already cancelled.'}, status=status.HTTP_400_BAD_REQUEST)

        reservation.cancel()
        return Response({'detail': 'Reservation cancelled successfully.'}, status=status.HTTP_200_OK)

    @extend_schema(tags=['Admin'])
    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        if not request.user.is_staff:
            raise PermissionDenied("You do not have permission to access this resource")

        params = request.query_params
        today = timezone.now().date()

        summary_type, group_by, sort_order = validate_summary_params(params)

        start_date, end_date = get_date_range(params, today)
        year, month, week, day = get_time_filters(params)

        queryset = self.get_queryset()
        queryset = apply_time_filters(queryset, year, month, week, day)

        has_explicit_time_filter = any([year, month, week, day])
        if not has_explicit_time_filter:
            queryset = apply_date_range_filters(queryset, start_date, end_date)

        if summary_type == 'today':
            return summary_today(queryset, today)

        if summary_type == 'total':
            return summary_total(queryset, year, month, week, day, start_date, end_date, has_explicit_time_filter)

        if summary_type == 'grouped':
            return summary_grouped(queryset, group_by, sort_order, year, month, week, day, start_date, end_date,
                                   has_explicit_time_filter)

        return Response({"error": "Invalid summary_type."}, status=status.HTTP_400_BAD_REQUEST)