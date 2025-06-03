from rest_framework import serializers
from .models import Reservation


class ReservationSerializer(serializers.ModelSerializer):
    parking_location_name = serializers.CharField(source='parking_location.name', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = ['id', 'parking_location', 'parking_location_name', 'user', 'user_username', 'start_time', 'end_time',
                  'is_cancelled', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['user', 'is_cancelled', 'created_at', 'updated_at']

    def get_is_active(self, obj):
        return obj.is_active()

    def validate(self, data):
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError("start_time must be earlier than end_time.")

        return data