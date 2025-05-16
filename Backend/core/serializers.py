from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'bio', 'phone', 'profile_image', 'profile_image_url','password'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def get_profile_image_url(self, obj):
        request = self.context.get('request')
        if obj.profile_image and hasattr(obj.profile_image, 'url'):
            return request.build_absolute_uri(obj.profile_image.url) if request else obj.profile_image.url
        return None

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect username or password.")
    
from .models import Car

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = ['id', 'brand', 'model', 'year', 'license_plate']

from .models import RepairShop




class RepairShopSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = RepairShop
        fields = ['id', 'name', 'location', 'contact_info', 'services', 'image', 'owner', 'average_rating']
        read_only_fields = ['owner']

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews.exists():
            return None
        return round(sum([r.rating for r in reviews])) / reviews.count(), 2

from .models import SparePart

from rest_framework import serializers
from .models import SparePart

class SparePartSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = SparePart
        fields = ['id', 'name', 'price', 'description', 'image', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['customer'] # allow status to be updated 

from .models import Bill

class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = '__all__'
        read_only_fields = ['date']

from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['repair_shop', 'rating']  # Only include repair_shop and rating
        read_only_fields = ['customer', 'created_at']

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate(self, data):
        # Removing appointment validation since it's no longer needed
        user = self.context['request'].user

        # Check if the user has already reviewed the shop
        if Review.objects.filter(customer=user, repair_shop=data['repair_shop']).exists():
            raise serializers.ValidationError("You have already reviewed this repair shop.")

        return data

    def create(self, validated_data):
        validated_data['customer'] = self.context['request'].user
        return super().create(validated_data)

    
from rest_framework import serializers
from .models import Bill

class AlignedBillSerializer(serializers.ModelSerializer):
    customerName = serializers.CharField(source='appointment.customer.username', read_only=True)
    shopName = serializers.CharField(source='appointment.repair_shop.name', read_only=True)
    totalPrice = serializers.FloatField(source='total_price')
    date = serializers.DateField()
    billStatus = serializers.SerializerMethodField()
    orderStatus = serializers.SerializerMethodField()

    class Meta:
        model = Bill
        fields = ['id', 'customerName', 'shopName', 'totalPrice', 'date', 'billStatus', 'orderStatus']

    def get_billStatus(self, obj):
        return "Paid" if obj.total_price and obj.total_price > 0 else "Pending"

    def get_orderStatus(self, obj):
        return "Validated" if obj.appointment.status == "confirmed" else "Not Validated"



