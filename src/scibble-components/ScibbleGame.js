import React, { useEffect, useState, useRef } from 'react';
import CanvasControls from './CanvasControls';

const ScibbleGame = (props) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [undoSteps, setUndoSteps] = useState({});
  const [redoStep, setRedoStep] = useState({});
  const [undo, setUndo] = useState(0);
  const [redo, setRedo] = useState(0);
  const [currentColor, setCurrentColor] = useState('black');
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2 -800;
    canvas.height = window.innerHeight * 2 -800;
    canvas.style.width = `${window.innerWidth-400}px`;
    canvas.style.height = `${window.innerHeight-400}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  }, [])

  const startDrawing = ({nativeEvent}) => {
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    const temp = {
      ...undoSteps,
      [undo + 1]: []
    };
    temp[undo + 1].push({ offsetX, offsetY });
    setUndoSteps(temp);
    setUndo(undo + 1);
    setIsDrawing(true);
  }

  const stopDrawing = () => {
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
    temp[undo].push({ offsetX, offsetY });
    setUndoSteps(temp);
  }

  const undoLastOperation = () => {
    console.log(undo)
    if (undo > 0) {
      const data = undoSteps[undo];
      contextRef.current.strokeStyle = "#DCDCDC";
      contextRef.current.beginPath();
      contextRef.current.lineWidth = 5;
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
      contextRef.current.strokeStyle = "black";
      contextRef.current.beginPath();
      contextRef.current.lineWidth = 5;
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
  }

  const onColorChange = (color) => {
    const context = canvasRef.current.getContext("2d");
    context.strokeStyle = color;
    contextRef.current = context;
    setCurrentColor(color);
  }

  return (
    <div className="canvas-container">
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
      />
    </div>
  )
}

export default ScibbleGame;
