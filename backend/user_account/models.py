from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    def update_password(self, new_password):
        """
        Updates the user's password and saves the user instance.
        """
        self.user.set_password(new_password)
        self.user.save()

    def update_username(self, new_username):
        """
        Updates the user's username and saves the user instance.
        """
        self.user.username = new_username
        self.user.save()

    def update_name(self, first_name=None, last_name=None):
        """
        Updates the user's first and/or last name and saves the user instance.
        """
        if first_name:
            self.user.first_name = first_name
        if last_name:
            self.user.last_name = last_name
        self.user.save()

    def deactivate(self):
        """
        Deactivates the user account by setting is_active to False.
        """
        self.user.is_active = False
        self.user.save()