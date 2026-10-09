from django.db import models
from django.contrib.auth.models import User
from products.models import Product

class PriceAlert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='price_alerts')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='price_alerts')
    target_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def is_triggered(self):
        return self.current_price <= self.target_price

    def __str__(self):
        return f"Alert for {self.product.name} @ ₹{self.target_price} by {self.user.username}"
