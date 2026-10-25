
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView
from rest_framework .authentication import TokenAuthentication
from rest_framework.permissions import AllowAny, IsAdminUser

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

class ProductUpdateView(RetrieveUpdateDestroyAPIView):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [TokenAuthentication]

    def get_permissions(self):
          if self.request.method == "GET":
              return [AllowAny()]
          return [IsAdminUser()]