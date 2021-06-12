import React from 'react';

const PlayerCard = (props) => {
  let elements = [];

  for (let key in props.playerHands) {
    if (props.current_player !== key) {
      elements.push(
        <li key={key}>
          <h2>{props.playerHands[key].length}</h2>
          <h3>{key}</h3>
        </li>
      )
    }
  }

  return (
    <ul className="tilesWrap">
      {elements}
    </ul>
  )
}

export default PlayerCard;
