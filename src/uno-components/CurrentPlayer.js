import React from 'react';
import Fade from 'react-reveal/Fade';
///static/deck_assets/
const CurrentPlayer = (props) => {
  let elements = [];

  const findCard = (card_name) => {
    for (let i = 0; i < props.hand.length; i++) {
      if (props.hand[i].name === card_name) {
        return props.hand[i];
      }
    }
  }

  const onMove = (e) => {
    e.preventDefault();

    if (props.turn === props.player) {
      let card_name = e.target.getAttribute('name');
      let card = findCard(card_name);

      if (card.number === props.activeCard.number
        || card.color === props.activeCard.color
        || card.number >= 13
        || card.color === props.currentColor) {

        let index = props.hands[props.player].indexOf(card);
        props.hands[props.player].splice(index, 1);
        //fix this
        if (card.number <= 9) {
          props.onGameUpdate(props.hands, card, props.player);
        } else if (card.number === 10) {
          props.onGameUpdate(props.hands, card, props.player, false, true);
        } else if (card.number === 11) {
          props.onGameUpdate(props.hands, card, props.player, true, false);
        } else if (card.number === 12) {
          props.onMultiDraw(props.player, 2);
          props.onGameUpdate(props.hands, card, props.player);
        } else if (card.number === 13) {
          props.onGameUpdate(props.hands, card, props.player);
        } else if (card.number === 14) {
          props.onMultiDraw(props.player, 4);
          props.onGameUpdate(props.hands, card, props.player);
        }
      }
    }
  }

  let id = 0;
  for (let i in props.hand) {
    let img = `/static/deck_assets/${props.hand[i].name}.png`;
    let name = props.hand[i].name;
    id += 1

    elements.push(
      <div className="colum" key={id}>
      <Fade right>
          <img
          className="player_cards"
          src={img}
          alt={props.hand[i].name}
          name={name}
          onClick={onMove}/>
      </Fade>
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
