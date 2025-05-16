from django.urls import path
from .views import RegisterView, LoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]
from .views import CarListCreateView, CarDetailView

urlpatterns += [
    path('cars/', CarListCreateView.as_view(), name='car-list-create'),
    path('cars/<int:pk>/', CarDetailView.as_view(), name='car-detail'),
]

from .views import RepairShopListCreateView, RepairShopDetailView

urlpatterns += [
    path('repairshops/', RepairShopListCreateView.as_view(), name='repairshop-list-create'),
    path('repairshops/<int:pk>/', RepairShopDetailView.as_view(), name='repairshop-detail'),
]
from .views import SparePartListCreateView, SparePartDetailView

urlpatterns += [
    path('spareparts/', SparePartListCreateView.as_view(), name='sparepart-list-create'),
    path('spareparts/<int:pk>/', SparePartDetailView.as_view(), name='sparepart-detail'),
]
from .views import AppointmentListCreateView, AppointmentUpdateView

urlpatterns += [
    path('appointments/', AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('appointments/<int:pk>/', AppointmentUpdateView.as_view(), name='appointment-update'),
]



from .views import BillCreateView, BillDetailView

urlpatterns += [
    path('bills/', BillCreateView.as_view(), name='bill-create'),
    path('bills/<int:pk>/', BillDetailView.as_view(), name='bill-detail'),
]

from .views import BillUpdateView

urlpatterns += [
    path('bills/<int:pk>/update/', BillUpdateView.as_view(), name='bill-update'),
]

from .views import ReviewListCreateView

urlpatterns += [
    path('reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
]

from .views import RepairShopReviewListView

urlpatterns += [
    path('repairshops/<int:pk>/reviews/', RepairShopReviewListView.as_view(), name='shop-reviews'),
]

from .views import ReviewCreateView

urlpatterns += [
    path('reviews/', ReviewCreateView.as_view(), name='review-create'),
]
from .views import DashboardView

urlpatterns += [
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
from .views import ActivityHistoryView

urlpatterns += [
    path('history/', ActivityHistoryView.as_view(), name='activity-history'),
]
from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.urls import path
from .views import BillingFrontendView

urlpatterns += [
    # ... your existing routes
    path('billing/', BillingFrontendView.as_view(), name='billing-frontend'),
]

from .views import UserProfileView

urlpatterns += [
    # ... your other routes
    path("user-profile/", UserProfileView.as_view(), name="user-profile"),
]
