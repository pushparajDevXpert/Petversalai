from django.db import models

# Create your models here.

class Product(models.Model):
    Category_Choice=[
        ("foods","Foods"),
        ("toys","Toys"),
        ("accessories","Acessories"),
        ("gromming","Gromming"),
    ]
    name=models.CharField(max_length=250)
    
    category=models.CharField(max_length=30,choices=Category_Choice)

    price=models.DecimalField(max_digits=10,decimal_places=2)
    description=models.TextField( blank=True,default="")

    stock=models.PositiveBigIntegerField(
        default=0
    )
   
    create_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
