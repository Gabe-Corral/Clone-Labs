import React from 'react';
import Pencil from './assets/pencil.png';
import Erase from './assets/erase.png';
import Size from './assets/size.png';
import Black from './assets/black.png';
import Brown from './assets/brown.png';
import Blue from './assets/blue.png';
import Yellow from './assets/yellow.png';
import Green from './assets/green.png';
import Red from './assets/red.png';
import Undo from './assets/undo.png';
import Redo from './assets/redo.png';

const CanvasControls = (props) => {

  const displayCurrentWord = (hint_indexs=[1]) => {
    if (props.currentWord !== "") {
      let displayedWord = [];
      for (let i = 0; i < props.currentWord.name.length; i++) {
          if (hint_indexs.includes(i)) {
            displayedWord.push(props.currentWord.name[i]);
          } else {
            displayedWord.push("_");
          }
      }
      return displayedWord.join(" ");
    }
  }

  return (
    <div className="cavnas-controls">
      <input
      type="image"
      src={Pencil}
      alt="pencil"
      width="20"
      height="20"
      id="pencil-img"
      onClick={props.onDraw}
      />
      <input
      type="image"
      src={Erase}
      alt="erase"
      width="20"
      height="20"
      id="erase-img"
      onClick={props.onErase}
      />
      <input
      type="image"
      src={Undo}
      alt="undo"
      width="20"
      height="20"
      id="undo-img"
      onClick={props.undoLastOperation}
      />
      <input
      type="image"
      src={Redo}
      alt="redo"
      width="20"
      height="20"
      id="redo-img"
      onClick={props.redoLastOperation}
      />
      <input
      type="image"
      src={Size}
      alt="pencil-size"
      width="8"
      height="8"
      id="size-img"
      onClick={() => props.onChangeSize(2)}
      />
      <input
      type="image"
      src={Size}
      alt="pencil-size"
      width="12"
      height="12"
      id="size-img"
      onClick={() => props.onChangeSize(5)}
      />
      <input
      type="image"
      src={Size}
      alt="pencil-size"
      width="20"
      height="20"
      id="size-img"
      onClick={() => props.onChangeSize(15)}
      />
      <input
      type="image"
      src={Size}
      alt="pencil-size"
      width="30"
      height="30"
      id="size-img"
      onClick={() => props.onChangeSize(25)}
      />
      <input
      type="image"
      src={Black}
      alt="black"
      width="30"
      height="30"
      id="black-img"
      onClick={() => props.onColorChange('black')}
      />
      <input
      type="image"
      src={Brown}
      alt="brown"
      width="30"
      height="30"
      id="brown-img"
      onClick={() => props.onColorChange('#8B4513')}
      />
      <input
      type="image"
      src={Red}
      alt="red"
      width="30"
      height="30"
      id="red-img"
      onClick={() => props.onColorChange('red')}
      />
      <input
      type="image"
      src={Green}
      alt="green"
      width="30"
      height="30"
      id="green-img"
      onClick={() => props.onColorChange('green')}
      />
      <input
      type="image"
      src={Yellow}
      alt="yellow"
      width="30"
      height="30"
      id="yellow-img"
      onClick={() => props.onColorChange('yellow')}
      />
      <input
      type="image"
      src={Blue}
      alt="blue"
      width="30"
      height="30"
      id="blue-img"
      onClick={() => props.onColorChange('blue')}
      />
      <h2>{displayCurrentWord()}</h2>
    </div>
  )
}

export default CanvasControls;
