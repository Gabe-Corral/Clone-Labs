from rest_framework import serializers
from .models import Game, Player, Card, Word, NormalCard

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = '__all__'

class NormalCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = NormalCard
        fields = '__all__'
