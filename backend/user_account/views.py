from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import generics, viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import UserSerializer, AdminTokenObtainPairSerializer, AdminUserSerializer, \
    CustomTokenObtainPairSerializer
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated


@extend_schema(tags=['Users'])
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

@extend_schema(tags=['Authentication'])
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@extend_schema(tags=['Authentication'])
class MyTokenRefreshView(TokenRefreshView):
    pass

@extend_schema(tags=['Authentication'])
class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer

@extend_schema(tags=['Users'])
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

@extend_schema(tags=['Admin'])
class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]

    ordering_fields = ['id', 'username','first_name', 'last_name', 'is_active']
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