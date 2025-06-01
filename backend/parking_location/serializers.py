from rest_framework import serializers
from .models import ParkingLocation


class ParkingLocationSerializer(serializers.ModelSerializer):
    available_slots = serializers.SerializerMethodField()
    start_time = serializers.SerializerMethodField()
    end_time = serializers.SerializerMethodField()

    class Meta:
        model = ParkingLocation
        fields = ['id', 'name', 'slots', 'available_slots', 'start_time', 'end_time', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_available_slots(self, obj):
        overlapping_count = getattr(obj, 'overlapping_count', None)
        if overlapping_count is not None:
            return max(obj.slots - overlapping_count, 0)
        return obj.available_slots()

    def get_start_time(self, obj):
        return self.context.get('start_time')

    def get_end_time(self, obj):
        return self.context.get('end_time')