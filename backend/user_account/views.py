from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserSerializer, AdminTokenObtainPairSerializer, AdminUserSerializer
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]

    ordering_fields = ['id', 'username','first_name', 'last_name']
    filterset_fields = ['id', 'is_active']
    search_fields = ['username', 'first_name', 'last_name']

    def get_queryset(self):
        return User.objects.filter(is_staff=False)

    @action(detail=True, methods=['post'], url_path='deactivate')
    def deactivate(self, request, pk=None):
        user = self.get_object()

        if not user.is_active:
            return Response({'error': 'User account is already disabled.'}, status=status.HTTP_400_BAD_REQUEST)

        user.profile.deactivate()
        return Response({'detail': f'User {user.username} has been deactivated.'}, status=status.HTTP_200_OK)