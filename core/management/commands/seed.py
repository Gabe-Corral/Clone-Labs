from django.core.management.base import BaseCommand

from ...models import Card, Word

class Command(BaseCommand):

    def create_cards(self):
        cards = {
            'red': ['0R', '1R', '1R', '2R', '2R', '3R', '3R', '4R', '4R', '5R', '5R', '6R', '6R', '7R', '7R', '8R', '8R', '9R', '9R', 'skipR', 'skipR', '_R', '_R', 'D2R', 'D2R'],
            'green': ['0G', '1G', '1G', '2G', '2G', '3G', '3G', '4G', '4G', '5G', '5G', '6G', '6G', '7G', '7G', '8G', '8G', '9G', '9G', 'skipG', 'skipG', '_G', '_G', 'D2G', 'D2G'],
            'blue': ['0B', '1B', '1B', '2B', '2B', '3B', '3B', '4B', '4B', '5B', '5B', '6B', '6B', '7B', '7B', '8B', '8B', '9B', '9B', 'skipB', 'skipB', '_B', '_B', 'D2B', 'D2B'],
            'yellow': ['0Y', '1Y', '1Y', '2Y', '2Y', '3Y', '3Y', '4Y', '4Y', '5Y', '5Y', '6Y', '6Y', '7Y', '7Y', '8Y', '8Y', '9Y', '9Y', 'skipY', 'skipY', '_Y', '_Y', 'D2Y', 'D2Y'],
            'wilds': ['W', 'W', 'W', 'W', 'D4W', 'D4W', 'D4W', 'D4W']
        }
        for k,v in cards.items():
            for i in range(len(v)):
                if v[i] == "W":
                    card = Card(name=v[i], number=13, color=k)
                elif v[i] == "D4W":
                    card = Card(name=v[i], number=14, color=k)
                elif v[i].startswith("skip"):
                    card = Card(name=v[i], number=10, color=k)
                elif v[i].startswith("_"):
                    card = Card(name=v[i], number=11, color=k)
                elif v[i].startswith("D2"):
                    card = Card(name=v[i], number=12, color=k)
                else:
                    num = int(v[i][0])
                    card = Card(name=v[i], number=num, color=k)
                card.save()

    def create_words(self):
        words = ["Painting", "Gold", "Actor", "Parrot", "Pencil", "Guitar",
                "Pizza", "Planet", "Queen", "Rain", "Refrigerator", "River",
                "Rocket", "School", "Shooter", "Window", "Garden", "Motorcycle",
                "Microphone", "Lion", "Lizard", "Death", "Grim Reaper",
                "Honey", "Scooter", "Lighter", "Kanye West", "Ghost", "Fountain",
                "Darth Vader", "Date", "Wife", "Leader", "Peace", "Speed", "Jack",
                "Bush", "Golf", "Plane", "Drama", "licence", "Dream", "Sleep"]

        for i in words:
            word = Word(name=i, length=len(i))
            word.save()

    def handle(self, *args, **options):
        self.create_cards()
        self.create_words()
