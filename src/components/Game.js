import React, {useState, useEffect} from 'react';
import JoinList from './JoinList'
import io from 'socket.io-client'

const ENDPOINT = 'http://localhost:5000';
let socket;

const Game = (props) => {
  const [players, setPlayers] = useState([]);
  const [game, setGame] = useState({});

  useEffect(() => {
    let game_name = window.location.pathname.split("/")[1];
    getGame(game_name);

    const connectionOptions =  {
      "forceNew" : true,
      "reconnectionAttempts": "Infinity",
      "timeout" : 10000,
      "transports" : ["websocket"]
      }

    socket = io.connect(ENDPOINT, connectionOptions);
    let data = {
      room: game_name,
      player: props.player.nickname}

    socket.emit('join', data, (error) => {
      if (error) console.log(error);
    })
  }, [props.player.nickname])

  useEffect(() => {
    socket.on("roomData", ({ users }) => {
      setPlayers(users)
    })
  }, [])

  const getGame = (game_name) => {
    fetch(`http://localhost:8000/game_name/${game_name}/`)
      .then(res => res.json())
      .then(res => setGame(res))
  }

  return (
    <div className="game_board">
      <ul>
        <JoinList players={players} game={game} />
      </ul>
    </div>
  )
}

export default Game;
