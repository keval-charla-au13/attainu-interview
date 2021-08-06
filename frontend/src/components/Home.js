import React from 'react';
import { Link } from 'react-router-dom';

const Home = (props) => {
  return (
    <div>
      <div className="title">Insert Coin</div>
      <Link to="/quiz">
        <button className="button">Start a quiz</button>
      </Link>
      <br />
      <br />
      <Link to="/topscores" data={props.data}>
        <button className="button">See the leaderboards</button>
      </Link>
    </div>
  );
};

export default Home;
