from django.db import models
from django.utils import timezone


class ParkingLocation(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slots = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def available_slots(self, start_time=None, end_time=None):
        from reservation.models import Reservation
        now = timezone.now()
        start = start_time or now
        end = end_time or now

        overlapping = Reservation.objects.filter(
            parking_location=self,
            start_time__lte=end,
            end_time__gte=start,
            is_cancelled=False,
        ).count()
        return max(self.slots - overlapping, 0)

    def __str__(self):
        return f"{self.name} ({self.slots}) slots"