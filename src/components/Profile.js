import React from "react";
import "../styles/profile.css";
const Profile = props => {
  return (
    <div className='profile-container'>
      <div className='profile-flex'>
        <div className='profile-image'>
          <img src={props.profilePicture} alt='profile' />
        </div>
        <div className='profile-info'>
          <div>{props.username}</div>
          <div>@{props.usernameShort}</div>
          <div>Tweets: {props.tweetCounter}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
