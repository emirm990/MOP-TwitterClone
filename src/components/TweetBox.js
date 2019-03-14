import React from "react";
import Tweet from "./Tweet.js";
import "../styles/tweetbox.css";

const TweetBox = props => {
  return (
    <div className='tweetbox-container'>
      <ul>
        {props.tweets.map((tweet, id) => (
          <Tweet
            key={id}
            tweet={tweet}
            usernameShort={props.usernameShort}
            profilePicture={props.profilePicture}
          />
        ))}
      </ul>
    </div>
  );
};

export default TweetBox;
