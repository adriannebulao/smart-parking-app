from django.db import models

class ParkingLocation(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slots = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.slots}) slots"