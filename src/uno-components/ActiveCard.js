import React from 'react';

const ActiveCard = (props) => {
  let img = process.env.PUBLIC_URL + `/deck_assets/${props.card}.png`;
  let imgBack = process.env.PUBLIC_URL + "/deck_assets/card-back.png";

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
