from django.db.models import Count, F, Q
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from .models import ParkingLocation
from .serializers import ParkingLocationSerializer
from .permissions import IsAdminOrReadOnly


@extend_schema(tags=['Parking Locations'])

class ParkingLocationViewSet(viewsets.ModelViewSet):
    queryset = ParkingLocation.objects.all()
    serializer_class = ParkingLocationSerializer
    permission_classes = (IsAuthenticated, IsAdminOrReadOnly)
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter)

    filterset_fields = {'slots'}
    search_fields = ['name']
    ordering_fields = ['id', 'name', 'slots', 'created_at', 'updated_at']
    ordering = ['id']

    def parse_times(self):
        """
        Parses 'start_time' and 'end_time' from query parameters.
        If not provided, defaults to the current time.
        Raises ValidationError if the format is invalid or start_time >= end_time.
        """
        start_time_str = self.request.query_params.get('start_time')
        end_time_str = self.request.query_params.get('end_time')
        if start_time_str and end_time_str:
            start_time = parse_datetime(start_time_str)
            end_time = parse_datetime(end_time_str)
            if not start_time or not end_time:
                raise ValidationError("Invalid start_time or end_time format. Use ISO 8601.")
            if start_time >= end_time:
                raise ValidationError("start_time must be before end_time.")
        else:
            now = timezone.now()
            start_time = now
            end_time = now
        return start_time, end_time

    def get_queryset(self):
        """
        Returns queryset of parking locations that have available slots
        for the given time range (from query params).
        Annotates each location with the count of overlapping reservations,
        and filters out locations with no available slots.
        """
        queryset = super().get_queryset()
        start_time, end_time = self.parse_times()
        overlapping_filter = Q(
            reservations__start_time__lt=end_time,
            reservations__end_time__gt=start_time,
            reservations__is_cancelled=False,
        )
        queryset = queryset.annotate(
            overlapping_count=Count('reservations', filter=overlapping_filter)
        ).filter(
            slots__gt=F('overlapping_count'),
        )
        return queryset

    def get_serializer_context(self):
        """
       Adds start_time and end_time to serializer context so that
       available_slots can be calculated for the requested time range.
       """
        context = super().get_serializer_context()
        start_time, end_time = self.parse_times()
        context['start_time'] = start_time
        context['end_time'] = end_time
        return context