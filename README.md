<h1 align="center">UNO</h1>
<h2 align="center">Online Multiplayer UNO Game</h2>

## About

This is a multiplayer UNO game. The game was built using React, Nodejs, SocketIO, Express, and Django.

## Game Rules

You can find the rules [here](https://www.unorules.com/).

## Gameplay

Once logged in you will be able to create a room or join a room. This design was inspired by Jackbox and Kahoot. As of right now, the game ends when one player wins, but I will change this in the near future.

## Plans For the Project

As of right now, this is purely an UNO game, but I plan on adding more Kahoot/Jackbox styled games to this project.

## Setup


```
git clone https://github.com/Gabe-Corral/Uno.git
cd Uno
pip install -r requirements.txt
npm install
npm run build
python manage.py runserver
```

You will also need to run the game server. Open a new terminal and run these commands.

```
cd Uno/server
node server.js
```

## Screenshots

<img src="screenshots/example-game.png" alt="Screenshot 1" width="75%" align="center" />

<img src="screenshots/join-list.png" alt="Screenshot 1" width="75%" align="center" />

<img src="screenshots/uno-homepage.png" alt="Screenshot 1" width="75%" align="center" />

## Things To Do

- Redesign winner component
- Bug fixes/improve code quality
- Add a profile page
- Clean up/improve the UI
