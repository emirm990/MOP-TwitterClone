import React from "react";
import "../styles/following.css";
const Following = props => {
  return (
    <div key={props.index} className='profile-following-item'>
      <img
        className='profile-following-image'
        src={props.following.profilePicture}
        alt='following profile'
      />
      <p className='profile-following-username'>{props.following.username}</p>
      <div className='profile-following-modal'>
        <img src={props.following.profilePicture} alt='following profile' />
        <div className='profile-following-modal-info'>
          <p className='profile-following-modal-p'>
            {props.following.username}
          </p>
          <p className='profile-following-modal-p'>
            {" "}
            Tweets: {props.following.tweets.length}
          </p>
          <button
            className='profile-following-unfollow'
            onClick={() => props.unfollow(props.following)}
          >
            Unfollow
          </button>
        </div>
      </div>
    </div>
  );
};

export default Following;
