from rest_framework import viewsets
from .models import Category, Location, InventoryItem, InventoryTransaction
from .serializers import (
    CategorySerializer,
    LocationSerializer,
    InventoryItemSerializer,
    InventoryTransactionSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all().order_by("name")
    serializer_class = InventoryItemSerializer


class InventoryTransactionViewSet(viewsets.ModelViewSet):
    queryset = InventoryTransaction.objects.all().order_by("-created_at")
    serializer_class = InventoryTransactionSerializer