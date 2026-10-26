
from decimal import Decimal, InvalidOperation

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView
from rest_framework .authentication import TokenAuthentication
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.exceptions import ValidationError

from .models import Product
from .serializers import ProductSerializer


class ProductListView(ListCreateAPIView):
    queryset = Product.objects.all().order_by("id")
    serializer_class = ProductSerializer
    # authantection
    authentication_classes=[TokenAuthentication]
    
    def get_permissions(self):
        if self.request.method=='POST':
            return [IsAdminUser()]
        return [AllowAny()]
   
    def get_queryset(self):
        queryset = Product.objects.all().order_by("id")

        category = self.request.query_params.get("category")
        search = self.request.query_params.get("search")
        min_price=self.request.query_params.get("min_price")
        max_price=self.request.query_params.get("max_price")
        in_stock=self.request.query_params.get("in_stock")

        try:
            min_value=Decimal(min_price) if min_price is not None else None
            max_value=Decimal(max_price) if max_price is not None else None
        except InvalidOperation:
            raise ValidationError({
                "price":"Enter valid number"
            })
        if min_value is not None and(
            not min_value.is_finite() or min_value<0
        ):
            raise ValidationError({
                "min_price": "Enter a non-negative number"
            })
        if max_value is not None and(
            not max_value.is_finite() or max_value<0
        ):
            raise ValidationError({
                "max_price":"Enter a non-negative number"
            })
        if (
            min_value is not None and
            max_value is not None
            and min_value> max_value
        ):
            raise ValidationError({
               "min_price": "Minimum price cannot be greater than maximum price."
            })


        if category:
            queryset = queryset.filter(category=category)

        if search:
            queryset = queryset.filter(name__icontains=search)

        if min_price:
            queryset=queryset.filter(price__gte=min_price)
        if max_price:
            queryset=queryset.filter(price__lte=max_price)
        if in_stock=="true":
            queryset=queryset.filter(stock__gt=0)
        elif in_stock=="false":
            queryset=queryset.filter(stock=0    )
        return queryset

    
class ProductUpdateView(RetrieveUpdateDestroyAPIView):  

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
          if self.request.method == "GET":
              return [AllowAny()]
          return [IsAdminUser()]