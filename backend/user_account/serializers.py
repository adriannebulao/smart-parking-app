from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from user_account.models import Profile


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'is_active', 'date_joined', 'last_login')
        read_only_fields = ('id', 'username', 'first_name', 'last_name', 'date_joined', 'last_login')

class UserSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'new_password','first_name', 'last_name')
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        Profile.objects.create(user=user)
        return user

    def update(self, instance, validated_data):
        profile = instance.profile

        username = validated_data.get('username')
        first_name = validated_data.get('first_name')
        last_name = validated_data.get('last_name')
        new_password = validated_data.get('new_password')

        if username:
            profile.update_username(username)
        if first_name or last_name:
            profile.update_name(
                first_name=first_name,
                last_name=last_name,
            )
        if new_password:
            profile.update_password(new_password)

        return instance

class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.is_staff:
            raise serializers.ValidationError('No admin privileges.')

        return data