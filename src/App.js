import React, {useState} from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import Game from './components/Game';
import './App.css';

export default function App() {
  const [player, setPlayer] = useState({});
  const [game, setGame] = useState({});

  const onJoin = (e) => {
    e.preventDefault()
    let room_code = e.target.server_id.value;
    getGameByName(room_code);
  }

  const getGameByName = (name) => {
    fetch(`http://localhost:8000/game_name/${name}/`)
      .then(res => res.json())
      .then(res => setGame(res))
  }

  const onCreateGame = (e) => {
    e.preventDefault()
    let room_name = e.target.room_name.value;
    createGame(room_name);
  }

  const createGame = (game_name) => {
    fetch("http://localhost:8000/create_game/", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        name: game_name
      })
    }).then(res => res.json())
    .then(res => setGame(res))
  }

  const createPlayer = (player_name) => {
    fetch("http://localhost:8000/post_player/", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        nickname: player_name
      })
    }).then(res => res.json())
    .then(res => setPlayer(res))
  }

  return (
    <Switch>
      <Route exact path="/">
        <Login />
      </Route>
      <Route exact path="/signup">
        <SignUp createPlayer={createPlayer} />
      </Route>
      <Route exact path="/joingame">
        <JoinGame onJoin={onJoin} />
      </Route>
      <Route exact path="/creategame">
        <CreateGame onCreateGame={onCreateGame} />
      </Route>
      <Route path="/:name">
        <Game player={player} game={game} />
      </Route>
    </Switch>
  );
}
