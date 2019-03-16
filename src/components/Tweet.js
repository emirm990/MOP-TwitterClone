import React from "react";
import Timestamp from "react-timestamp";

import "../styles/tweet.css";
const Tweet = props => {
  return (
    <li className='list-item'>
      <div className='tweet-picture-container'>
        <img src={props.profilePicture} alt='profile' />
      </div>
      <div className='tweet-content'>
        <span className='tweet-username'>@{props.usernameShort} </span>
        <Timestamp
          className='tweet-time'
          time={props.timesOfTweet}
          autoUpdate
        />
        <p>{props.tweet}</p>
      </div>
    </li>
  );
};

export default Tweet;
