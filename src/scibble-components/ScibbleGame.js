import React, { useEffect, useState, useRef, useCallback } from 'react';
import CanvasControls from './CanvasControls';
import MessageBox from './MessageBox';
import JoinList from '../components/JoinList';
import io from 'socket.io-client';
import { useHistory } from "react-router-dom";

const ENDPOINT = 'http://localhost:5000';
let socket;

const ScibbleGame = (props) => {
  const history = useHistory();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [undoSteps, setUndoSteps] = useState({});
  const [redoStep, setRedoStep] = useState({});
  const [undo, setUndo] = useState(0);
  const [redo, setRedo] = useState(0);

  const [currentColor, setCurrentColor] = useState('black');
  const [currenLineWidth, setCurrentLineWidth] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);

  const gameName = props.gameName;
  const [gameStart, setGameStart] = useState(false);
  const [players, setPlayers] = useState([]);
  const [playerTurn, setPlayerTurn] = useState('');
  const [game, setGame] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [wordList, setWordList] = useState([]);
  const [currentWord, setCurrentWord] = useState('');

  const getWords = useCallback(() => {
    fetch(`${process.env.REACT_APP_.BASE_URL}/words/`)
    .then(res => res.json())
    .then(res => {
      setWordList(res)
      setCurrentWord(res[Math.floor(Math.random()*res.length)]);
    })
  }, [])

  const getGame = useCallback(() => {
    fetch(`${process.env.REACT_APP_.BASE_URL}/game_name/${gameName}/`)
      .then(res => res.json())
      .then(res => {
        setGame(res);
        if (props.player.id === res.host_id) {
          getWords();
        }
      }).catch(error => {
        history.push("/")
      })
  }, [gameName, props.player.id, history, getWords])

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

    socket.on('initGameState', ({gameOver, playerTurn, gameStart, currentWord, wordList}) => {
      setGameOver(gameOver);
      setPlayerTurn(playerTurn);
      setGameStart(gameStart);
      createCanvas();
      setWordList(wordList);
      setCurrentWord(currentWord);
      console.log(currentWord.name)
    })

    socket.on('updateCanvas', ({
                                start, color, offsetX, offsetY,
                                playerTurn, lineWidth, callUndo,
                                callRedo
                              }) => {

      if (playerTurn !== props.player.nickname) {
        setCurrentColor(color);
        setCurrentLineWidth(lineWidth);

        const context = canvasRef.current.getContext("2d");
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        contextRef.current = context;

        if (callUndo) {
          undoLastOperation();
        } else if (callRedo) {
          redoLastOperation();
        } else if (start) {
          startDrawingView(offsetX, offsetY)
        } else {
          drawView(offsetX, offsetY);
        }
      }
    })

    socket.on("roomData", ({ users }) => {
      setPlayers(users);
    })

  }, [props.player.nickname, currentColor])

  const createCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2 -800;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight-400}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  }

  const startDrawingView = (offsetX, offsetY) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    const temp = {
      ...undoSteps,
      [undo + 1]: []
    };
    temp[undo + 1].push({ offsetX, offsetY, currenLineWidth, currentColor });
    setUndoSteps(temp);
    setUndo(undo + 1);
  }

  const drawView = (offsetX, offsetY) => {
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  }

  const startDrawing = ({nativeEvent}) => {
    if (props.player.nickname !== playerTurn) {
      return;
    }
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    const temp = {
      ...undoSteps,
      [undo + 1]: []
    };
    temp[undo + 1].push({ offsetX, offsetY, currenLineWidth, currentColor });
    setUndoSteps(temp);
    setUndo(undo + 1);
    setIsDrawing(true);

    if (playerTurn === props.player.nickname) {
      socket.emit('updateCanvas', {
        start: true,
        color: currentColor,
        offsetX: offsetX,
        offsetY: offsetY,
        playerTurn: playerTurn,
        lineWidth: canvasRef.current.getContext("2d").lineWidth,
        callUndo: false,
        callRedo: false
      })
    }
  }

  const stopDrawing = () => {
    if (props.player.nickname !== playerTurn) {
      return;
    }
    contextRef.current.closePath();
    setIsDrawing(false);
  }

  const draw = ({nativeEvent}) => {
    if (!isDrawing) {
      return;
    }
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    const temp = {
      ...undoSteps
    };
    temp[undo].push({ offsetX, offsetY, currenLineWidth, currentColor });
    setUndoSteps(temp);

    if (playerTurn === props.player.nickname) {
      socket.emit('updateCanvas', {
        start: false,
        color: currentColor,
        offsetX: offsetX,
        offsetY: offsetY,
        playerTurn: playerTurn,
        lineWidth: canvasRef.current.getContext("2d").lineWidth,
        callUndo: false,
        callRedo: false
      })
    }
  }

  const undoLastOperation = () => {
    if (undo > 0) {
      const data = undoSteps[undo];
      contextRef.current.strokeStyle = "#DCDCDC";
      contextRef.current.beginPath();
      contextRef.current.lineWidth = data[0].currenLineWidth+1;
      contextRef.current.moveTo(data[0].offsetX, data[0].offsetY);
      data.forEach((item, index) => {
        if (index !== 0) {
          contextRef.current.lineTo(item.offsetX, item.offsetY);
          contextRef.current.stroke();
        }
      });
      contextRef.current.closePath();
      contextRef.current.strokeStyle = currentColor;
      const temp = {
        ...undoSteps,
        [undo]: []
      };
      const te = {
        ...redoStep,
        [redo + 1]: [...data]
      };
      setUndo(undo - 1);
      setRedo(redo + 1);
      setRedoStep(te);
      setUndoSteps(temp);
    }
  }

  const redoLastOperation = () => {
    if (redo > 0) {
      const data = redoStep[redo];
      contextRef.current.strokeStyle = data[0].currentColor;
      contextRef.current.beginPath();
      contextRef.current.lineWidth = data[0].currenLineWidth;
      contextRef.current.moveTo(data[0].offsetX, data[0].offsetY);
      data.forEach((item, index) => {
        if (index !== 0) {
          contextRef.current.lineTo(item.offsetX, item.offsetY);
          contextRef.current.stroke();
        }
      });
      contextRef.current.closePath();
      const temp = {
        ...redoStep,
        [redo]: []
      };
      setUndo(undo + 1);
      setRedo(redo - 1);
      setRedoStep(temp);
      setUndoSteps({
        ...undoSteps,
        [undo + 1]: [...data]
      });
    }
  }

  const onErase = () => {
    const context = canvasRef.current.getContext("2d");
    context.strokeStyle = "#DCDCDC";
    context.lineWidth = 15;
    contextRef.current = context;
  }

  const onDraw = () => {
    const context = canvasRef.current.getContext("2d");
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  }

  const onChangeSize = (size) => {
    const context = canvasRef.current.getContext("2d");
    context.lineWidth = size;
    contextRef.current = context;
    setCurrentLineWidth(size);
  }

  const onColorChange = (color) => {
    const context = canvasRef.current.getContext("2d");
    context.strokeStyle = color;
    contextRef.current = context;
    setCurrentColor(color);
  }

  const onGameUpdate = (startDrawing=false, draw=false, stopDrawing=false, nativeEvent=null) => {
    socket.emit('updateGameState', {
      startDrawing: startDrawing,
      draw: draw,
      stopDrawing: stopDrawing,
      nativeEvent: nativeEvent
    })
  }

  const onGameStart = (e) => {
    e.preventDefault();
    setGameStart(true);

    socket.emit('initGameState', {
      gameOver: false,
      playerTurn: props.player.nickname,
      gameStart: true,
      currentWord: currentWord,
      wordList: wordList
    })
  }

  return (
    <div className="canvas-container">
      {gameStart ? (
        <div>
          <canvas className="draw-canvas"
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            ref={canvasRef}
          />
          <CanvasControls
            onDraw={onDraw}
            onErase={onErase}
            onChangeSize={onChangeSize}
            onColorChange={onColorChange}
            undoLastOperation={undoLastOperation}
            redoLastOperation={redoLastOperation}
            currentWord={currentWord}
          />
          <MessageBox
            players={players}
            player={props.player.nickname}
            playerTurn={playerTurn}
            socket={socket}
            currentWord={currentWord}
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

export default ScibbleGame;
