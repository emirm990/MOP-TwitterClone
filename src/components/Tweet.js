import React from "react";
import "../styles/tweet.css";

const Tweet = props => {
  return (
    <li className='list-item'>
      <div className='tweet-picture-container'>
        <img src={props.profilePicture} alt='profile' />
      </div>
      <div className='tweet-content'>
        <p>@{props.usernameShort} </p>
        <p>{props.tweet}</p>
      </div>
    </li>
  );
};

export default Tweet;
