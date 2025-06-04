from rest_framework import serializers
from .models import ParkingLocation


class ParkingLocationSerializer(serializers.ModelSerializer):
    available_slots = serializers.SerializerMethodField()
    start_time = serializers.CharField(read_only=True)
    end_time = serializers.CharField(read_only=True)

    class Meta:
        model = ParkingLocation
        fields = ['id', 'name', 'slots', 'available_slots', 'start_time', 'end_time', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_available_slots(self, obj):
        """
        Returns the available slots for the parking location
        using the time range provided in the serializer context.
        """
        start_time = self.context.get('start_time')
        end_time = self.context.get('end_time')
        return obj.available_slots(start_time, end_time)

    def get_start_time(self, obj):
        return self.context.get('start_time')

    def get_end_time(self, obj):
        return self.context.get('end_time')