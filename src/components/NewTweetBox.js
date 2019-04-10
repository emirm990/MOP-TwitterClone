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
            times.profilePicture,
            times.owner_id
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
              datakey={index}
              key={index}
              usernameShort={"@" + item[2].toLowerCase().replace(/\s/g, "")}
              timesOfTweet={item[0]}
              profilePicture={item[3]}
              tweet={item[1]}
              comment={props.comment}
              owner_id={item[4]}
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
