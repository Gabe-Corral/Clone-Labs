import React, { useEffect, useState, useRef } from 'react';

const ScibbleGame = (props) => {
  const canvasRef = useRef(null);
  const contexRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contexRef.current = context;
  }, [])

  const startDrawing = ({nativeEvent}) => {
    const {x, y} = nativeEvent;
    contexRef.current.beginPath();
    contexRef.current.moveTo(x, y);
    setIsDrawing(true);
  }

  const stopDrawing = () => {
    contexRef.current.closePath();
    setIsDrawing(false);
  }

  const draw = ({nativeEvent}) => {
    if (!isDrawing) {
      return;
    }
    const {x, y} = nativeEvent;
    contexRef.current.lineTo(x, y);
    contexRef.current.stroke();
  }

  return (
    <div>
      <canvas className="draw-canvas"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </div>
  )
}

export default ScibbleGame;
