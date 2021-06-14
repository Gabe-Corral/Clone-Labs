import React from 'react';
import party from 'party-js';

const Winner = (props) => {

  // party.sparkles(runButton, {
  // 	count: party.variation.range(10, 60),
  // 	speed: party.variation.range(50, 300),
  // });

  return (
    <div class="card-container">
    	<span class="pro">PRO</span>
    	<h3>{props.winner}</h3>
    	<h6>Winner</h6>
    	<p>If you ain't first, then you're last</p>
    </div>
  )
}
export default Winner;
