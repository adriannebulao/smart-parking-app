from django.db import models
from django.utils import timezone


class ParkingLocation(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slots = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def available_slots(self, start_time=None, end_time=None):
        """
       Returns the number of available slots for this parking location
       within the given time range. If no time is provided, uses the current time.

       Counts overlapping reservations that are not cancelled and subtracts
       from the total slots.
       """
        from reservation.models import Reservation
        now = timezone.now()
        start = start_time or now
        end = end_time or now

        # Count reservations that overlap with the given time range and are not cancelled
        overlapping = Reservation.objects.filter(
            parking_location=self,
            start_time__lte=end,
            end_time__gte=start,
            is_cancelled=False,
        ).count()
        # Ensure available slots is not negative
        return max(self.slots - overlapping, 0)

    def __str__(self):
        return f"{self.name} ({self.slots}) slots"