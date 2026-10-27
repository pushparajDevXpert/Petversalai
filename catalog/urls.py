from django.urls import path
from .views import ProductListView, ProductUpdateView

urlpatterns = [
    path(
        "products/",
        ProductListView.as_view(),
        name="product-list"
    ),
    path("products/<int:pk>/",
    ProductUpdateView.as_view(),
    name="product-update"
    )
]