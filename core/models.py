from django.db import models
from django import forms
from django.contrib.auth import get_user_model

User = get_user_model()

class Game(models.Model):
    name = models.CharField(max_length=20)
    game_type = models.CharField(max_length=20, null=True)
    host_id = models.IntegerField(null=True)
    winner = models.CharField(max_length=40, null=True)

    def __str__(self):
        return self.name

class Player(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    nickname = models.CharField(max_length=15)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.nickname

class Card(models.Model):
    name = models.CharField(max_length=10)
    number = models.IntegerField()
    color = models.CharField(max_length=10)

    def __str__(self):
        return self.name

class Word(models.Model):
    name = models.CharField(max_length=50)
    length = models.IntegerField()

    def __str__(self):
        return self.name

class NormalCard(self):
    name = models.CharField(max_length=30)
    number = models.IntegerField()
    suit = models.CharField(max_length=20)

    def __str__(self):
        return self.name
