import React from 'react';

const JoinList = (props) => {

  return (
    <div className="frame">
      <div className="center">
    		<section className="todo-cmp">
    			<header className="todo-cmp__header">
    				<h2>{props.game.name}</h2>
            <p>Players:</p>
    			</header>
    				<ul className="todo-cmp__list">
              {props.players.map((player, index) =>
                <li key={index}>
                  <label key={index}>
                    <span>{player.name}</span>
                  </label>
                </li>
              )}
    			</ul>
    		</section>
      </div>
        <div class="box">
          <a href="#" class="btn btn-white btn-animation-1">Start Game</a>
        </div>
    </div>
  )
}

export default JoinList
