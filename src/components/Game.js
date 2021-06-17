import React, { useState, useEffect, useCallback } from 'react';
import JoinList from './JoinList';
import PlayerCard from './PlayerCard';
import CurrentPlayer from './CurrentPlayer';
import ActiveCard from './ActiveCard';
import Winner from './winner';
import io from 'socket.io-client';
import Flip from 'react-reveal/Flip';

const ENDPOINT = 'http://localhost:5000';
let socket;

const Game = (props) => {
  const gameName = window.location.pathname.split("/")[1];
  const [players, setPlayers] = useState([]);
  const [game, setGame] = useState({});
  const [deck, setDeck] = useState([]);
  const [gameStart, setGameStart] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerTurn, setPlayerTurn] = useState('');
  const [playerHands, setPlayerHands] = useState({});
  const [activeCard, setActiveCard] = useState('');
  const [currentColor, setCurrentColor] = useState('red');
  const [winner, setWinner] = useState('');

  const getGame = useCallback(() => {
    fetch(`${process.env.REACT_APP_.BASE_URL}/game_name/${gameName}/`)
      .then(res => res.json())
      .then(res => {
        setGame(res);
        if (props.player.id === res.host_id) {
          getDeck(res.id);
        }
      })
  }, [gameName, props.player.id])

  const onConnect = useCallback(() => {
    const connectionOptions =  {
      "forceNew" : true,
      "reconnectionAttempts": "Infinity",
      "timeout" : 10000,
      "transports" : ["websocket"]
      }

    socket = io.connect(ENDPOINT, connectionOptions);
    let data = {
      room: gameName,
      player: props.player.nickname,
      winPhrase: props.winPhrase
    }

    socket.emit('join', data, (error) => {
      if (error) console.log("error: ", error);
    })
  }, [props.player.nickname, props.winPhrase, gameName])

  useEffect(() => {
    getGame();
    onConnect();
  }, [onConnect, getGame])

  useEffect(() => {
    socket.on('initGameState', ({gameOver, playerTurn, playerHands, deck, activeCard, gameStart, currentColor}) => {
      setGameOver(gameOver);
      setPlayerTurn(playerTurn);
      setPlayerHands(playerHands);
      setDeck(deck);
      setActiveCard(activeCard);
      setGameStart(gameStart);
      setCurrentColor(currentColor);
    })

    socket.on('updateGameState', ({gameOver, playerTurn, playerHands, deck, activeCard, gameStart, currentColor, winner, players}) => {
      setGameOver(gameOver);
      setPlayerTurn(playerTurn);
      setPlayerHands(playerHands);
      setDeck(deck);
      setActiveCard(activeCard);
      setGameStart(gameStart);
      setCurrentColor(currentColor);
      setWinner(winner);
      setPlayers(players);
    })

    socket.on("roomData", ({ users }) => {
      setPlayers(users);
    })
  }, [])

  const getDeck = (game_id) => {
    fetch(`${process.env.REACT_APP_.BASE_URL}/game/${game_id}/cards/`)
      .then(res => res.json())
      .then(res => setDeck(res))
  }

  const assignPlayerHands = () => {
    let hands = {};
    let current_deck = deck;

    players.forEach(p => {
      if (p.name) {
        hands[p.name] = current_deck.splice(0, 7);
      }
    })

    setDeck(current_deck);
    return hands;
  }

  const updatePlayerTurn = (player, reverse=false, skip=false) => {
    let playerList = Array.from(players);
    let index;

    for (let i = 0; i < playerList.length; i++) {
      if (playerList[i].name === player) {
        index = i;
      }
    }

    if (reverse && playerList.length === 2) {
      return player;
    } else if (reverse && index !== 0) {
      setPlayers(players.reverse())
      return playerList[index-1].name;
    } else if (reverse && index === 0) {
      setPlayers(players.reverse())
      return playerList[playerList.length-1].name;
    } else if (skip && playerList.length === 2) {
      return player;
    } else if (skip && playerList.length-1 === index) {
      return playerList[1].name;
    } else if (skip && playerList.length-1 >= index+2) {
      return playerList[index+2].name;
    } else if (skip && playerList.length-1 <= index+2) {
      return playerList[0].name;
    } else if (playerList.length-1 === index) {
      return playerList[0].name;
    } else {
      return playerList[index+1].name;
    }
  }

  const onColorSelect = (newCard) => {
    const colorOptions = ['red', 'blue', 'yellow', 'green'];

    if (newCard.number >= 13) {
      let newColor = prompt('Enter the new color (red/green/blue/yellow)').toLowerCase();

      if (colorOptions.includes(newColor)) {
        return newColor;
      } else {
        return colorOptions[Math.floor(Math.random() * colorOptions.length)];
      }

    } else {
      return newCard.color;
    }
  }

  const initialActiveCard = () => {
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].number <= 9) return deck[i];
    }
  }

  const onMultiDraw = (player, cards) => {
    let new_player = updatePlayerTurn(player);
    let new_cards = deck.splice(0, cards);
    playerHands[new_player].push(...new_cards);

    socket.emit('updateGameState', {
      gameOver: false,
      playerTurn: new_player,
      playerHands: playerHands,
      deck: deck,
      activeCard: activeCard,
      gameStart: true,
      currentColor: currentColor,
      winner: winner,
      players: players
    })
  }

  const checkForWinner = (newHands) => {
    for (let key in newHands) {
      if (newHands[key].length === 0) {
        return key;
      }
    }
    return false;
  }

  const onGameUpdate = (newHands, newCard, player, reverse=false, skip=false) => {
    socket.emit('updateGameState', {
      gameOver: checkForWinner(newHands) === false ? false : true,
      playerTurn: updatePlayerTurn(player, reverse, skip),
      playerHands: newHands,
      deck: deck,
      activeCard: newCard,
      gameStart: true,
      currentColor: onColorSelect(newCard),
      winner: checkForWinner(newHands),
      players: players
    })
  }

  const onGameStart = (e) => {
    e.preventDefault();
    let playerHands = assignPlayerHands();
    let initialCard = initialActiveCard();

    socket.emit('initGameState', {
      gameOver: false,
      playerTurn: props.player.nickname,
      playerHands: playerHands,
      deck: deck,
      activeCard: initialCard,
      gameStart: true,
      currentColor: initialCard.color
    })
  }

  const onDrawCard = (e) => {
    e.preventDefault();
    let randomIndex = Math.floor(Math.random() * deck.length);
    let hand = playerHands[props.player.nickname];
    hand.push(deck[randomIndex]);
    playerHands[props.player.nickname] = hand;

    socket.emit('updateGameState', {
      gameOver: false,
      playerTurn: playerTurn,
      playerHands: playerHands,
      deck: deck,
      activeCard: activeCard,
      gameStart: true,
      currentColor: currentColor,
      players: players
    })
  }

  return (
    <div className={currentColor}>
      {gameStart ? (
        gameOver ? (
          <Flip left>
            <Winner
            winner={winner}
            players={players}
            player_id={props.player.id}
            game={game}
            />
          </Flip>
        ) : (
          <div>
            <PlayerCard
            playerHands={playerHands}
            current_player={props.player.nickname}
            turn={playerTurn}
            />

            <ActiveCard
            card={activeCard.name}
            onDrawCard={onDrawCard}
            />
            <CurrentPlayer
              hands={playerHands}
              hand={playerHands[props.player.nickname]}
              player={props.player.nickname}
              turn={playerTurn}
              activeCard={activeCard}
              onGameUpdate={onGameUpdate}
              currentColor={currentColor}
              onMultiDraw={onMultiDraw}
            />
          </div>
        )
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
//bugs
//update winner
//animations
//get ready to deploy
