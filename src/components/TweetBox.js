import React from "react";
import Tweet from "./Tweet.js";
import "../styles/tweetbox.css";

const TweetBox = props => {
  return (
    <div className='tweetbox-container'>
      <ul>
        {props.tweets.map((tweet, index) => (
          <Tweet
            key={index}
            datakey={index}
            length={props.tweets.length}
            tweet={tweet}
            timesOfTweet={props.timesOfTweets[index]}
            usernameShort={props.usernameShort}
            profilePicture={props.profilePicture}
            comment={props.comment}
            owner_id={props.owner_id}
          />
        ))}
      </ul>
    </div>
  );
};

export default TweetBox;
