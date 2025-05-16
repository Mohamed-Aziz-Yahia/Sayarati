from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.permissions import BasePermission

class IsOwnerOfSparePart(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.seller == request.user

class IsOwnerOfRepairShop(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class IsOwnerOfAppointment(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.repair_shop.owner == request.user

class IsOwnerOfBill(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.appointment.repair_shop.owner == request.user

class IsOwnerOfCar(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
from rest_framework.permissions import BasePermission


