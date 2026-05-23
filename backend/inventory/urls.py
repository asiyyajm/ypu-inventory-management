from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,
    LocationViewSet,
    InventoryItemViewSet,
    InventoryTransactionViewSet,
)


router = DefaultRouter()
router.register("categories", CategoryViewSet)
router.register("locations", LocationViewSet)
router.register("items", InventoryItemViewSet)
router.register("transactions", InventoryTransactionViewSet)

urlpatterns = [
    path("", include(router.urls)),
]