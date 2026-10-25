from decimal import Decimal

from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    price=serializers.DecimalField(
      max_digits=10,
      decimal_places=2,
      min_value=Decimal("0.01")
    )
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "category",
            "price",
            "stock",
            
        ]

    