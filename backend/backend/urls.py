
from django.conf import settings
from django.urls import path, include
from user_account.views import AdminTokenObtainPairView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('api/admin/login/', AdminTokenObtainPairView.as_view(), name='admin_login'),
    path('api/', include('user_account.urls')),
    path('api/parking_locations/', include('parking_location.urls')),
    path('api/reservations/', include('reservation.urls')),
]

if settings.DEBUG:
    urlpatterns += [
        path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
        path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger'),
    ]
