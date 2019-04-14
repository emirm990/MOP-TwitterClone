import React, { useEffect, useState } from "react";
import Timestamp from "react-timestamp";
import Comments from "./Comments.js";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faComments } from "@fortawesome/free-solid-svg-icons";
import "../styles/tweet.css";
library.add(faEyeSlash, faComments);
const Tweet = props => {
  let comments = [];
  useEffect(() => {
    let formated = [];
    formated[0] = props.tweet;
    try {
      if (formated[0].length === 1) {
        comments = formated[0][0].split("&?");
      } else {
        comments = formated[0].split("&?");
      }
    } catch (err) {
      console.log(err);
    }
    setComment(comments);
  }, [props.tweet]);
  const [comment, setComment] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [posted, setPosted] = useState(false);

  function clearComment(key) {
    if (key === 13) {
      setInputValue("");
      setPosted(true);
    }
    setTimeout(function() {
      setPosted(false);
    }, 2000);
  }
  return (
    <React.Fragment>
      <li className='list-item'>
        <div className='tweet-picture-container'>
          <img src={props.profilePicture} alt='profile' />
        </div>
        <div className='tweet-content'>
          <span className='tweet-username'>{props.usernameShort}</span>
          <Timestamp
            className='tweet-time'
            time={props.timesOfTweet}
            autoUpdate
          />
          <p>{comment[0]}</p>
        </div>
      </li>
      <div className='comments-input'>
        <input
          type='text'
          placeholder='Please enter your comment and press Enter'
          className={
            commentsOpen ? "comments-input-open" : "comments-input-closed"
          }
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={event => {
            props.comment(props, inputValue, event.keyCode);
            clearComment(event.keyCode);
          }}
        />
        <div
          className={
            posted ? "posted-indicator posted" : "posted-indicator not-posted"
          }
        >
          <span>Posted</span>
        </div>
        {commentsOpen ? (
          <button
            className='open-comments-button --opened-comments'
            onClick={() => setCommentsOpen(!commentsOpen)}
          >
            <FontAwesomeIcon icon='eye-slash' size='lg' />
          </button>
        ) : (
          <button
            className='open-comments-button --closed-comments'
            onClick={() => setCommentsOpen(!commentsOpen)}
          >
            <FontAwesomeIcon icon='comments' size='lg' />
          </button>
        )}
      </div>

      <div
        className={
          commentsOpen ? "comments comments-open" : "comments comments-closed"
        }
      >
        {comment.map((comment, index) =>
          index === 0 ? null : (
            <div key={index}>
              <Comments comment={comment} />
            </div>
          )
        )}
      </div>
    </React.Fragment>
  );
};

export default Tweet;
