import React from 'react';

class Game extends React.Component {

  render() {
    return (
      <div>
        <h1>
        {this.props.player.nickname} {this.props.game.name}
        </h1>
      </div>
    )
  }
}

export default Game;
