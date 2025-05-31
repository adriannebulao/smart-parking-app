from rest_framework import serializers
from .models import ParkingLocation


class ParkingLocationSerializer(serializers.ModelSerializer):
    available_slots = serializers.IntegerField(read_only=True)

    class Meta:
        model = ParkingLocation
        fields = ['id', 'name', 'slots', 'available_slots', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']