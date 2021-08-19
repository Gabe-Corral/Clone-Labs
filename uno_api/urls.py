from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from django.views.generic import TemplateView

from core.views import GameView, PlayerView, CardView, getCSRFToken, LoginView, LogoutView, CheckAuthenticatedView, WordView

router = DefaultRouter()
router.register('players', PlayerView)
router.register('game', GameView)
router.register('card', CardView)

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path('admin/', admin.site.urls),

    path('players/', PlayerView.as_view({'get': 'players'}), name="players"),
    path('player/<int:pk>/', PlayerView.as_view({'get': 'player'}), name='player'),
    path('post_player/', PlayerView.as_view({'post': 'post_player'}), name='post_player'),
    path('delete_player/<int:pk>/', PlayerView.as_view({'delete': 'delete_player'}), name='delete_player'),
    path('patch_player/<int:pk>/', PlayerView.as_view({'patch': 'patch_player'}), name='patch_player'),

    path('game/<int:pk>/', GameView.as_view({'get': 'get_game'}), name='get_game'),
    path('game_name/<str:name>/', GameView.as_view({'get': 'get_game_by_name'}), name='get_game_by_name'),
    path('create_game/', GameView.as_view({'post': 'create_game'}), name='create_game'),
    path('patch_game/<int:pk>/', GameView.as_view({'patch': 'patch_game'}), name='patch_game'),

    path('cards/', CardView.as_view({'get': 'get_cards'}), name='get_cards'),
    path('patch_card/<int:pk>/', CardView.as_view({'patch': 'patch_card'}), name='patch_card'),

    path('words/', WordView.as_view({'get': 'get_words'}), name='get_words'),
    path('random_word/', WordView.as_view({'get': 'get_random_word'}), name='get_random_word'),

    path('cookie/', getCSRFToken.as_view({'get': 'get_token'}), name='get_token'),

    path('authenticated/', CheckAuthenticatedView.as_view({'get': 'get'}), name='get'),
    path('login/', LoginView.as_view({'post': 'post'}), name='post'),
    path('logout/', LogoutView.as_view({'post': 'post'}), name='post'),

    re_path(r'^.*', TemplateView.as_view(template_name='index.html'))
]+router.urls
