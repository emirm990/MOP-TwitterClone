import React from "react";
import Tweet from "./Tweet.js";
import "../styles/tweetbox.css";

const TweetBox = props => {
  return (
    <div className='tweetbox-container'>
      <ul>
        {props.tweets
          .slice(0)
          .reverse()
          .map((tweet, index) => (
            <Tweet
              key={index}
              tweet={tweet}
              timesOfTweet={props.timesOfTweets.slice(0).reverse()[index]}
              usernameShort={props.usernameShort}
              profilePicture={props.profilePicture}
            />
          ))}
      </ul>
    </div>
  );
};

export default TweetBox;
