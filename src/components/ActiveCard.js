import React from 'react';

const ActiveCard = (props) => {
  let img = process.env.PUBLIC_URL + `/deck_assets/${props.card}.png`;

  return (
    <div>
      <img className="active_card" src={img} alt={props.card} />
    </div>
  )
}

export default ActiveCard;
