from django.contrib import admin

from .models import Product

# Register your models here.
@admin.register(Product)
class ProducAdmin(admin.ModelAdmin):
    lis_display=(
        "id",
        "name",
        "category",
        "price",
        "stock",
        "created_at",
    )
    search_fields=("name",)
    list_filter=("category",)

