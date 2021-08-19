from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from django.contrib import auth
from django.contrib.auth.models import User
import random

from rest_framework import viewsets, permissions
from rest_framework.response import Response

from .serializers import GameSerializer, PlayerSerializer, CardSerializer, WordSerializer
from .models import Game, Player, Card, Word

@method_decorator(csrf_protect, name='dispatch')
class CheckAuthenticatedView(viewsets.ViewSet):
    def get(self, request, format=None):
        user = request.user
        isAuthenticated = user.is_authenticated

        if isAuthenticated:
            player = Player.objects.get(nickname=user)
            data = PlayerSerializer(player).data
            return Response(data)
        return Response("Error")

class GameView(viewsets.ViewSet):
    permissions_classes = (permissions.AllowAny, )
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def create_game(self, request):
        serializer = GameSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            game = Game.objects.get(id=serializer.data['id'])
            return Response(serializer.data)
        return Response("Wrong parameters")

    def get_game(self, request, pk):
        game = Game.objects.get(id=pk)
        serializer = GameSerializer(game)
        return Response(serializer.data)

    def get_game_by_name(self, request, name):
        game = Game.objects.get(name=name)
        serializer = GameSerializer(game)
        return Response(serializer.data)

    def patch_game(self, request, pk):
        game = Game.objects.get(id=pk)
        serializer = GameSerializer(game, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response("Wrong parameters.")

@method_decorator(csrf_protect, name='dispatch')
class PlayerView(viewsets.ViewSet):
    permissions_classes = (permissions.AllowAny, )
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

    def players(self, request):
        qs = Player.objects.all()
        serializer = PlayerSerializer(qs, many=True)
        return Response(serializer.data)

    def player(self, request, pk):
        player = Player.objects.get(id=pk)
        serializer = PlayerSerializer(player)
        return Response(serializer.data)

    def delete_player(self, request, pk):
        player = Player.objects.get(id=pk)
        player.delete()
        return Response("Player deleted.")

    def post_player(self, request):
        data = request.data
        nickname = data['nickname']
        password = password=data['password']
        user = User.objects.create_user(username=nickname, password=password)
        player = Player.objects.create(nickname=nickname, user=user)
        return Response(PlayerSerializer(player).data)

    def patch_player(self, request, pk):
        player = Player.objects.get(id=pk)
        serializer = PlayerSerializer(player, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response("Wrong parameters.")

@method_decorator(csrf_protect, name='dispatch')
class LoginView(viewsets.ViewSet):
    permissions_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = request.data
        nickname = data['nickname']
        password = data['password']
        user = auth.authenticate(username=nickname, password=password)

        if user is not None:
            auth.login(request, user)
            player = Player.objects.get(nickname=nickname)
            data = PlayerSerializer(player).data
            return Response(data)
        return Response({'error': 'Not authenticated'})

class LogoutView(viewsets.ViewSet):
    def post(self, request, format=None):
        auth.logout(request)
        return Response({'success': 'Logged out'})

class CardView(viewsets.ViewSet):
    permissions_classes = (permissions.AllowAny, )
    queryset = Card.objects.all()
    serializer_class = CardSerializer

    def get_cards(self, request):
        qs = Card.objects.all()
        serializer = CardSerializer(qs, many=True)
        return Response(self.shuffle_cards(serializer.data))

    def patch_card(self, request, pk):
        card = Card.objects.get(id=pk)
        serializer = CardSerializer(card, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response("Wrong parameters.")

    def shuffle_cards(self, cards, num=1):
        #fisher yates shuffle algorithm
        length = len(cards)
        for _ in range(num):
            for i in range(length-1, 0, -1):
                randi = random.randint(0, i)
                if i == randi:
                    continue
                cards[i], cards[randi] = cards[randi], cards[i]
        return cards

@method_decorator(ensure_csrf_cookie, name='dispatch')
class getCSRFToken(viewsets.ViewSet):
    permissions_classes = (permissions.AllowAny, )

    def get_token(self, request, format=None):
        return Response({ 'success': 'Cookie set.' })

class WordView(viewsets.ViewSet):
    permissions_classes = (permissions.AllowAny, )
    queryset = Word.objects.all()
    serializer_class = WordSerializer

    def get_words(self, request):
        qs = Word.objects.all()
        serializer = WordSerializer(qs, many=True)
        return Response(serializer.data)

    def get_random_word(self, request):
        qs = Word.objects.all()
        word = random.choice(qs)
        serializer = WordSerializer(word)
        return Response(serializer.data)
