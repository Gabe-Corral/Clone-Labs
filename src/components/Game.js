import React, {useState, useEffect} from 'react';
import JoinList from './JoinList';
import PlayerCard from './PlayerCard';
import CurrentPlayer from './CurrentPlayer';
import ActiveCard from './ActiveCard';
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000';
let socket;

const Game = (props) => {
  const [players, setPlayers] = useState([]);
  const [game, setGame] = useState({});
  const [deck, setDeck] = useState([]);
  const [gameStart, setGameStart] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerTurn, setPlayerTurn] = useState('');
  const [playerHands, setPlayerHands] = useState({});
  const [activeCard, setActiveCard] = useState('');
  const [turnIndex, setTurnIndex] = useState(0);

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
    socket.on('initGameState', ({gameOver, playerTurn, playerHands, deck, activeCard, gameStart}) => {
      setGameOver(gameOver);
      setPlayerTurn(playerTurn);
      setPlayerHands(playerHands);
      setDeck(deck);
      setActiveCard(activeCard);
      setGameStart(gameStart);
    })

    socket.on('updateGameState', ({gameOver, playerTurn, playerHands, deck, activeCard, gameStart}) => {
      setGameOver(gameOver);
      setPlayerTurn(playerTurn);
      setPlayerHands(playerHands);
      setDeck(deck);
      setActiveCard(activeCard);
      setGameStart(gameStart);
    })

    socket.on("roomData", ({ users }) => {
      setPlayers(users);
    })
  }, [])

  const getGame = (game_name) => {
    fetch(`http://localhost:8000/game_name/${game_name}/`)
      .then(res => res.json())
      .then(res => {
        setGame(res);
        if (props.player.id === res.host_id) {
          getDeck(res.id)
        }
      })
  }

  const getDeck = (game_id) => {
    fetch(`http://localhost:8000/game/${game_id}/cards/`)
      .then(res => res.json())
      .then(res => setDeck(res))
  }

  const assignPlayerHands = () => {
    let hands = {};
    let current_deck = deck;

    players.map(p => {
      if (p.name) {
        hands[p.name] = current_deck.splice(0, 7);
      }
    })
    setDeck(current_deck);
    return hands;
  }

  const updatePlayerTurn = (player, reverse=false, skip=false) => {
    let index;
    for (let i = 0; i < players.length; i++) {
      if (players[i].name === player) {
        index = i;
      }
    }
    //this needs to be changed
    if (reverse && index !== 0) {
      let player = players[index-1].name;
      setPlayers(players.reverse());
      return player;
    } else if (reverse && index === 0) {
      let player = players[players.length-1].name;
      setPlayers(players.reverse());
      return player;
    } else if (skip) {
      if (players.length > index+2) {
        return players[index+2].name;
      } else {
        return players[1].name;
      }
    } else if (players.length > index+1) {
      return players[index+1].name;
    } else {
      return players[0].name;
    }
  }

  const onGameUpdate = (newHands, newCard, player, reverse=false, skip=false) => {
    socket.emit('updateGameState', {
      gameOver: false,
      playerTurn: updatePlayerTurn(player, reverse, skip),
      playerHands: newHands,
      deck: deck,
      activeCard: newCard,
      gameStart: true
    })
  }

  const onGameStart = (e) => {
    e.preventDefault();
    let playerHands = assignPlayerHands();;

    socket.emit('initGameState', {
      gameOver: false,
      playerTurn: props.player.nickname,
      playerHands: playerHands,
      deck: deck,
      activeCard: deck[0],
      gameStart: true,
    })
  }

  return (
    <div className="game_board">
      {gameStart ? (
        <div>
          <PlayerCard
          playerHands={playerHands}
          current_player={props.player.nickname}
          />

          <ActiveCard
          card={activeCard.name}
          />

          <CurrentPlayer
            hands={playerHands}
            hand={playerHands[props.player.nickname]}
            player={props.player.nickname}
            turn={playerTurn}
            activeCard={activeCard}
            onGameUpdate={onGameUpdate}
          />
        </div>
      ) : (
        <JoinList
        players={players}
        game={game}
        current_player={props.player}
        onGameStart={onGameStart}
        />
      )}
    </div>
  )
}

export default Game;
