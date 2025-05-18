from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer, LoginSerializer
from .filters import SparePartFilter

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

from rest_framework.permissions import IsAuthenticated

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import LoginSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'message': 'Login successful',
                'user_id': user.id,
                'username': user.username
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import generics, permissions
from .models import Car
from .serializers import CarSerializer

class CarListCreateView(generics.ListCreateAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

from .permissions import IsOwnerOfCar
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Car
from .serializers import CarSerializer
from .permissions import IsOwnerOfCar

class CarDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [IsAuthenticated, IsOwnerOfCar]


from .models import RepairShop
from .serializers import RepairShopSerializer



from rest_framework import generics
from .models import RepairShop
from .serializers import RepairShopSerializer

from .permissions import IsOwnerOfAppointment # Optional reuse

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import RepairShop
from .serializers import RepairShopSerializer


class RepairShopDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RepairShop.objects.all()
    serializer_class = RepairShopSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        repair_shop = super().get_object()
        if repair_shop.owner != self.request.user:
            raise PermissionDenied("You are not allowed to access or modify this repair shop.")
        return repair_shop

from rest_framework import generics, permissions, filters
from .models import RepairShop
from .serializers import RepairShopSerializer



from rest_framework import generics, permissions, filters
from .models import RepairShop
from .serializers import RepairShopSerializer

class RepairShopListCreateView(generics.ListCreateAPIView):
    queryset = RepairShop.objects.all()
    serializer_class = RepairShopSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'location', 'contact_info']

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


from .models import SparePart
from .serializers import SparePartSerializer

from rest_framework import generics
from .models import SparePart
from .serializers import SparePartSerializer



from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from .models import SparePart
from .serializers import SparePartSerializer
from .filters import SparePartFilter
from .permissions import  IsOwnerOfSparePart

from rest_framework.permissions import IsAuthenticated
from .models import SparePart
from .serializers import SparePartSerializer
from .filters import SparePartFilter # assuming this is your custom filter
from rest_framework import generics

class SparePartListCreateView(generics.ListCreateAPIView):
    serializer_class = SparePartSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = SparePartFilter
    search_fields = ['name', 'description']

    def get_queryset(self):
        # Only return spare parts owned by the current seller
        return SparePart.objects.filter(seller=self.request.user)
    def get_serializer_context(self):
        return {'request': self.request}
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
    


from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import SparePart
from .serializers import SparePartSerializer
from .permissions import  IsOwnerOfSparePart

class SparePartDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SparePart.objects.all()
    serializer_class = SparePartSerializer
    permission_classes = [IsAuthenticated,IsOwnerOfSparePart]
    def get_serializer_context(self):
        return {'request': self.request}


from .models import Appointment
from .serializers import AppointmentSerializer








from rest_framework.response import Response
from rest_framework import status


from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Appointment, Bill, Review
from .serializers import AppointmentSerializer, BillSerializer, ReviewSerializer
from .permissions import (
   
    IsOwnerOfAppointment,
    IsOwnerOfBill,
)

# -----------------------------
# APPOINTMENTS
# -----------------------------

class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['status']

    def get_queryset(self):
        queryset = Appointment.objects.all()
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)


class AppointmentUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOfAppointment]

    def update(self, request, *args, **kwargs):
        appointment = self.get_object()

        response = super().update(request, *args, **kwargs)

        # Auto-generate bill if confirmed and no bill exists
        updated_appointment = self.get_object()
        if updated_appointment.status == "confirmed" and not hasattr(updated_appointment, 'bill'):
            Bill.objects.create(
                appointment=updated_appointment,
                total_price=0.0, # default
                order_info="Auto-generated bill. Please update details."
            )

        return response

# -----------------------------
# BILLS
# -----------------------------

class BillCreateView(generics.CreateAPIView):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated]


class BillDetailView(generics.RetrieveAPIView):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated , IsOwnerOfBill]


class BillUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated,  IsOwnerOfBill]

    def update(self, request, *args, **kwargs):
        bill = self.get_object()
        if bill.appointment.repair_shop.owner != request.user:
            return Response(
                {
                    "success": False,
                    "message": "Only the repair shop owner can update this bill."
                },
                status=status.HTTP_200_OK
            )
        return super().update(request, *args, **kwargs)


# -----------------------------
# REVIEWS
# -----------------------------

class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]    

    
from .models import Review
from .serializers import ReviewSerializer

from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer

class ReviewListCreateView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the customer to the logged-in user
        serializer.save(customer=self.request.user)


class RepairShopReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        shop_id = self.kwargs['pk']
        return Review.objects.filter(repair_shop__id=shop_id)
    


from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Appointment, Bill, Review, RepairShop, SparePart
from rest_framework.permissions import IsAuthenticated

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # As Repair Shop Owner
        shops = RepairShop.objects.filter(owner=user)
        shop_appointments = Appointment.objects.filter(repair_shop__in=shops, status='confirmed')
        shop_reviews = Review.objects.filter(repair_shop__in=shops)
        shop_bills = Bill.objects.filter(appointment__in=shop_appointments)

        total_revenue = sum([b.total_price for b in shop_bills])
        average_rating = round(
            sum([r.rating for r in shop_reviews]) / shop_reviews.count(), 2
        ) if shop_reviews.exists() else None

        # As Customer
        customer_appointments = Appointment.objects.filter(customer=user)
        customer_reviews = Review.objects.filter(customer=user)
        customer_bills = Bill.objects.filter(appointment__in=customer_appointments)

        total_spent = sum([b.total_price for b in customer_bills])

        # As Seller
        parts = SparePart.objects.filter(seller=user)
        total_parts = parts.count()
        avg_price = round(sum([p.price for p in parts]) / total_parts, 2) if total_parts else None

        return Response({
            # Repair Shop Owner metrics
            "shop_total_appointments": shop_appointments.count(),
            "shop_total_revenue": total_revenue,
            "shop_review_count": shop_reviews.count(),
            "shop_average_rating": average_rating,

            # Customer metrics
            "customer_total_appointments": customer_appointments.count(),
            "customer_reviewed_appointments": customer_reviews.count(),
            "customer_total_spent": total_spent,

            # Seller metrics
            "seller_total_spare_parts": total_parts,
            "seller_average_price": avg_price,
        })

        
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Appointment, Review, Bill, RepairShop, SparePart
from .serializers import ReviewSerializer

class ActivityHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get appointments (whether for customer or repair shop)
        appointments = Appointment.objects.filter(customer=user) | Appointment.objects.filter(repair_shop__owner=user)
        
        # Get reviews (whether by a customer or repair shop owner)
        reviews = Review.objects.filter(customer=user) | Review.objects.filter(repair_shop__owner=user)
        
        # Get bills (whether for a customer or repair shop owner)
        bills = Bill.objects.filter(appointment__customer=user) | Bill.objects.filter(appointment__repair_shop__owner=user)

        # Get spare parts listed by sellers
        parts = SparePart.objects.filter(seller=user)  # Seller can sell parts
        parts_data = [
            {
                "name": p.name,
                "price": p.price,
                "description": p.description
            } for p in parts
        ]

        # Appointments data
        appointments_data = [
            {
                "customer": a.customer.username,
                "repair_shop": a.repair_shop.name,
                "car": a.car.model,
                "date": a.date,
                "time": str(a.time),
                "status": a.status,
            } for a in appointments
        ]

        # Reviews data (only include repair_shop and rating)
        reviews_data = [
            {
                "repair_shop": r.repair_shop.id,  # Only include repair_shop ID
                "rating": r.rating,
                "date": r.created_at
            } for r in reviews
        ]

        # Bills data
        bills_data = [
            {
                "customer": b.appointment.customer.username,
                "shop": b.appointment.repair_shop.name,
                "amount": b.total_price,
                "date": b.date,
                "summary": b.order_info
            } for b in bills
        ]

        # Returning the response with spare parts, appointments, reviews, and bills
        return Response({
            "appointments": appointments_data,
            "reviews": reviews_data,
            "bills": bills_data,
            "spare_parts": parts_data  # Spare parts available for buying from the seller
        })

    
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Bill
from .serializers import AlignedBillSerializer

class BillingFrontendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Fetch bills for the user, whether they are a repair shop or a customer
        bills = Bill.objects.filter(appointment__customer=user) | Bill.objects.filter(appointment__repair_shop__owner=user)

        serializer = AlignedBillSerializer(bills, many=True)
        return Response(serializer.data)


from django.http import JsonResponse
from django.views import View

class TestEndpointView(View):
    """
    A simple view for testing the deployment.
    Returns a JSON message.
    """
    def get(self, request, *args, **kwargs):
        return JsonResponse({"message": "Test endpoint is working!", "status": "success"})
