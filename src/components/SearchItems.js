import React, { useState, useEffect } from "react";
import "../styles/searchitems.css";

const SearchItems = props => {
  const [following, setFollowing] = useState(false);

  function checkIfFollowing() {
    for (let i = 0; i < props.following.length; i++) {
      if (props.id === props.following[i].owner_id) {
        setFollowing(true);
        break;
      } else setFollowing(false);
    }
  }

  useEffect(() => {
    checkIfFollowing();
  }, [props.item]);

  return (
    <div className='search-item-with-button'>
      <div className='search-item-container'>
        <img
          className='search-item-img'
          src={props.item.profilePicture}
          alt='profile'
        />
        <div className='search-item-username'>
          <p>{props.item.username}</p>
          <p>{"@" + props.item.username.toLowerCase().replace(/\s/g, "")}</p>
          <p>Tweets: {props.item.tweets.length}</p>
        </div>
      </div>
      {following ? (
        <button
          className='unfollow'
          onClick={() => {
            props.unfollow(props.item);
            setFollowing(false);
          }}
        >
          Unfollow
        </button>
      ) : (
        <button
          className='follow'
          onClick={() => {
            props.follow(props.item);
            setFollowing(true);
          }}
        >
          Follow
        </button>
      )}
    </div>
  );
};

export default SearchItems;
