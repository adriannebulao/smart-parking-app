from django.db import models
from django.utils import timezone


class ParkingLocation(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slots = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def available_slots(self):
        from reservation.models import Reservation
        now = timezone.now()
        active_count = Reservation.objects.filter(
            parking_location=self,
            start_time__lte=now,
            end_time__gte=now,
            is_cancelled=False,
        ).count()
        return max(self.slots - active_count, 0)

    def __str__(self):
        return f"{self.name} ({self.slots}) slots"