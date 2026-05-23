from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Location(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class InventoryItem(models.Model):
    CONDITION_CHOICES = [
        ("new", "New"),
        ("good", "Good"),
        ("used", "Used"),
        ("damaged", "Damaged"),
    ]

    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)
    unit = models.CharField(max_length=50, default="items")
    condition = models.CharField(
        max_length=20,
        choices=CONDITION_CHOICES,
        default="good"
    )
    notes = models.TextField(blank=True)
    low_stock_level = models.PositiveIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_low_stock(self):
        return self.quantity <= self.low_stock_level

    def __str__(self):
        return self.name


class InventoryTransaction(models.Model):
    TRANSACTION_TYPES = [
        ("donation_in", "Donation In"),
        ("distributed_out", "Distributed Out"),
        ("sold", "Sold"),
        ("adjustment", "Adjustment"),
    ]

    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=30, choices=TRANSACTION_TYPES)
    quantity = models.PositiveIntegerField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item.name} - {self.transaction_type} - {self.quantity}"