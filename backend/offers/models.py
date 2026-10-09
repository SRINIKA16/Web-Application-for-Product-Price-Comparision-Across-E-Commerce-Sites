from django.db import models
from products.models import Product
from stores.models import Store

class ProductOffer(models.Model):
    AVAILABILITY_CHOICES = [
        ('In Stock', 'In Stock'),
        ('Out of Stock', 'Out of Stock'),
        ('Limited Stock', 'Limited Stock'),
        ('Pre-Order', 'Pre-Order'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='offers')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='offers')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    delivery_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    availability = models.CharField(max_length=50, choices=AVAILABILITY_CHOICES, default='In Stock')
    rating = models.FloatField(default=4.5)
    product_url = models.URLField(max_length=500, blank=True)
    is_conditional_offer = models.BooleanField(default=False)
    offer_details = models.CharField(max_length=255, blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('product', 'store')
        ordering = ['price']

    @property
    def final_price(self):
        """Final Price = Product Price - Applicable Discount + Delivery Charge"""
        return max(0, float(self.price) - float(self.discount) + float(self.delivery_charge))

    def __str__(self):
        return f"{self.product.name} @ {self.store.name} - ₹{self.final_price}"

class PriceHistory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='price_history')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='price_history')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    recorded_at = models.DateTimeField()

    class Meta:
        ordering = ['recorded_at']

    def __str__(self):
        return f"{self.product.name} - ₹{self.price} on {self.recorded_at.strftime('%Y-%m-%d')}"
