from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView

from adminaccount.serializers import AdminTokenObtainPairSerializer


class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer
