from django.conf import settings
from django.db import models
from django.utils import timezone


class Reservation(models.Model):
    parking_location = models.ForeignKey('ParkingLocation', on_delete=models.CASCADE, related_name='reservations')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reservations')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_cancelled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_active(self):
        now = timezone.now()
        return not self.is_cancelled and self.start_time <= now <= self.end_time

    def cancel(self):
        self.is_cancelled = True
        self.save()

    def __str__(self):
        return f"Reservation {self.id} for {self.parking_location.name} by {self.user.username}"