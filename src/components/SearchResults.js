import React from "react";
import SearchItems from "./SearchItems.js";
import "../styles/searchresults.css";

const SearchResults = props => {
  return (
    <ul className='search-list'>
      {props.searchResultsArray.map((item, index) => (
        <li className='search-list-item' key={index}>
          <SearchItems
            item={item}
            id={item.owner_id}
            follow={props.follow}
            unfollow={props.unfollow}
            following={props.following}
          />
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;
