import React, {useEffect} from 'react';
import Confetti from 'react-confetti'

const Winner = (props) => {

const width = window.innerWidth;
const height = window.innerHeight ;

useEffect(() => {
  if (props.game.host_id === props.player_id) {
    fetch(`http://localhost:8000/patch_game/${props.game.id}/`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify({
        winner: props.winner
      })
    })
  }
}, [props.game.host_id, props.player_id, props.winner, props.game.id])

const displayWinPhrase = () => {
  for (let i = 0; i < props.players.length; i++) {
    if (props.players[i].name === props.winner) {
      return props.players[i].winPhrase
    }
  }
}

  return (
    <div className="winner">
    <Confetti
      width={width}
      height={height}
      />
      <div className="card-container">
      	<span className="pro">PRO</span>
      	<h3>{props.winner}</h3>
      	<h6>Winner</h6>
      	<p>{displayWinPhrase()}</p>
      </div>
    </div>
  )
}
export default Winner;
