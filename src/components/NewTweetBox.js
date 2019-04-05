import React from "react";
import Tweet from "./Tweet.js";
import "../styles/tweetbox.css";
let newTimesSorted = [];

const NewTweetBox = props => {
  const sort = () => {
    let array = [];
    let timesSorted = [];
    array.push(props.tweets);
    array.map(item => {
      item.map(times => {
        times.timesOfTweets.map((timesOfTweets, index) => {
          timesSorted.push([
            timesOfTweets,
            times.tweets[index],
            times.username,
            times.profilePicture
          ]);
          return (newTimesSorted = timesSorted.sort(function(a, b) {
            return b[0] - a[0];
          }));
        });
        return null;
      });
      return null;
    });
  };
  sort();

  if (props.tweets.length !== 0) {
    return (
      <div className='tweetbox-container'>
        <ul>
          {newTimesSorted.map((item, index) => (
            <Tweet
              key={index}
              usernameShort={"@" + item[2].toLowerCase().replace(/\s/g, "")}
              timesOfTweet={item[0]}
              profilePicture={item[3]}
              tweet={item[1]}
            />
          ))}
        </ul>
      </div>
    );
  } else {
    return null;
  }
};

export default NewTweetBox;
