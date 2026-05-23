from rest_framework import serializers
from .models import Category, Location, InventoryItem, InventoryTransaction


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"


class InventoryItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    location_name = serializers.CharField(source="location.name", read_only=True)
    is_low_stock = serializers.SerializerMethodField()

    class Meta:
        model = InventoryItem
        fields = "__all__"

    def get_is_low_stock(self, obj):
        return obj.is_low_stock()


class InventoryTransactionSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="item.name", read_only=True)

    class Meta:
        model = InventoryTransaction
        fields = "__all__"

    def create(self, validated_data):
        item = validated_data["item"]
        transaction_type = validated_data["transaction_type"]
        quantity = validated_data["quantity"]

        if transaction_type == "donation_in":
            item.quantity = item.quantity + quantity

        elif transaction_type == "distributed_out" or transaction_type == "sold":
            if item.quantity - quantity < 0:
                raise serializers.ValidationError(
                    "Not enough inventory for this transaction."
                )

            item.quantity = item.quantity - quantity

        elif transaction_type == "adjustment":
            item.quantity = quantity

        item.save()

        transaction = InventoryTransaction.objects.create(**validated_data)
        return transaction