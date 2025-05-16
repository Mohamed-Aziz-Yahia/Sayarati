from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):
    bio = models.TextField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

    def __str__(self):
        return f"{self.username}"

class Car(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    brand = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    license_plate = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.brand} {self.model} ({self.license_plate})"

from django.db import models

class RepairShop(models.Model):
    SERVICE_CHOICES = [
        ('repairing', 'Repairing'),
        ('towing', 'Towing'),
        ('both', 'Repairing & Towing'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    contact_info = models.CharField(max_length=100)  # Phone number or general contact
    services = models.CharField(max_length=10, choices=SERVICE_CHOICES, default='repairing')
    image = models.ImageField(upload_to='repair_shops/', null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.location}"


class SparePart(models.Model):
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    price = models.FloatField()
    description = models.TextField()
    image = models.ImageField(upload_to='spare_parts/', null=True, blank=True)

    def __str__(self):
        return f"{self.name} - ${self.price}"

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('rejected', 'Rejected'),
    ]

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    repair_shop = models.ForeignKey(RepairShop, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Appointment for {self.car} at {self.repair_shop} on {self.date} {self.time}"

class Bill(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE)
    total_price = models.FloatField()
    date = models.DateField(auto_now_add=True)
    order_info = models.TextField()

    def __str__(self):
        return f"Bill for {self.appointment}"

from django.db import models
from django.conf import settings
from .models import RepairShop

class Review(models.Model):
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    repair_shop = models.ForeignKey(RepairShop, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.rating} stars for {self.repair_shop.name}"

