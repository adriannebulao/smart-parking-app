from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    def update_password(self, new_password):
        self.user.set_password(new_password)
        self.user.save()

    def update_username(self, new_username):
        self.user.username = new_username
        self.user.save()

    def update_name(self, first_name=None, last_name=None):
        if first_name:
            self.user.first_name = first_name
        if last_name:
            self.user.last_name = last_name
        self.user.save()

    def deactivate(self):
        self.user.is_active = False
        self.user.save()
