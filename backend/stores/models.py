from django.db import models

class Store(models.Model):
    name = models.CharField(max_length=100, unique=True)
    logo = models.CharField(max_length=255, blank=True)
    website = models.URLField(max_length=255, blank=True)
    active = models.BooleanField(default=True)
    rating = models.FloatField(default=4.5)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
