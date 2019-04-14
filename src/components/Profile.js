import React from "react";
import "../styles/profile.css";
const Profile = props => {
  return (
    <React.Fragment>
      <div className='profile-flex'>
        <div className='profile-image'>
          <img id='profile-image' src={props.profilePicture} alt='profile' />
        </div>
        <div className='profile-info'>
          <div>{props.username}</div>
          <div>{props.usernameShort}</div>
          <div>Tweets: {props.tweetCounter}</div>
        </div>
      </div>
      <div className='profile-following'>
        <p>Following: </p>
        {props.following.map((following, index) => (
          <div key={index} className='profile-following-item'>
            <img
              className='profile-following-image'
              src={following.profilePicture}
              alt='following profile'
            />
            <p className='profile-following-username'>{following.username}</p>
            <button
              className='profile-following-unfollow'
              onClick={() => props.unfollow(props.following[index])}
            >
              Unfollow
            </button>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default Profile;
