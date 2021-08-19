import React from 'react';

const ActiveCard = (props) => {
  let img = `/static/deck_assets/${props.card}.png`;
  let imgBack = "/static/deck_assets/card-back.png";

  return (
    <div className="active_card_container">
      <img
      className="back_card"
      src={imgBack} alt="draw_card"
      onClick={props.onDrawCard}
      />
      <img
      className="active_card"
      src={img} alt={props.card}
      />
    </div>
  )
}

export default ActiveCard;
