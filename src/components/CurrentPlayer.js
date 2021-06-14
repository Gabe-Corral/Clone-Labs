import React from 'react';

const CurrentPlayer = (props) => {
  let elements = [];

  const onMove = (e) => {
    e.preventDefault();
    let card = e.target.getAttribute('name');
    card = props.hands[props.player].filter(c => c.name === card);
    console.log(props.currentColor, card[0].color)
    //this needs to be changed
    if (props.turn === props.player) {
      if (card[0].number === props.activeCard.number || card[0].color === props.activeCard.color || card[0].number >= 13 || card[0].color === props.currentColor) {
        let index = props.hands[props.player].indexOf(card[0]);
        let newHands = props.hands[props.player].splice(index, 1);
        if (card[0].number <= 9) {
          props.onGameUpdate(props.hands, card[0], props.player);
        } else if (card[0].number === 10) {
          props.onGameUpdate(props.hands, card[0], props.player, false, true);
        } else if (card[0].number === 11) {
          props.onGameUpdate(props.hands, card[0], props.player, true, false);
        } else if (card[0].number === 13) {
          props.onGameUpdate(props.hands, card[0], props.player);
        }
      }
    }
  }

  for (let i in props.hand) {
    let img = process.env.PUBLIC_URL+`/deck_assets/${props.hand[i].name}.png`;
    let name = props.hand[i].name;

    elements.push(
      <div className="colum" key={name}>
        <img className="player_cards" src={img} alt={props.hand[i].name} name={name} onClick={onMove}/>
      </div>
    )
  }

  return (
    <div className="row">
      {elements}
    </div>
  )
}

export default CurrentPlayer;
