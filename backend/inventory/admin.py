from django.contrib import admin
from .models import Category, Location, InventoryItem, InventoryTransaction


admin.site.register(Category)
admin.site.register(Location)
admin.site.register(InventoryItem)
admin.site.register(InventoryTransaction)