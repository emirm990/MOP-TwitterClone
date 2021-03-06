import React, { Component } from "react";
import Profile from "./components/Profile.js";
import TweetBox from "./components/TweetBox.js";
import Uploader from "./components/Uploader";
import NewTweetBox from "./components/NewTweetBox.js";
import SearchResults from "./components/SearchResults.js";
import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential
} from "mongodb-stitch-browser-sdk";
import "./styles/app.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.usernameInput = this.usernameInput.bind(this);
    this.usernameInputKeyHandler = this.usernameInputKeyHandler.bind(this);
    this.handleTweetChange = this.handleTweetChange.bind(this);
    this.handleTweetKeyDown = this.handleTweetKeyDown.bind(this);
    this.post = this.post.bind(this);
    this.updateDb = this.updateDb.bind(this);
    this.uploadPicture = this.uploadPicture.bind(this);
    this.getSearch = this.getSearch.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.searchResults = this.searchResults.bind(this);
    this.follow = this.follow.bind(this);
    this.unfollow = this.unfollow.bind(this);
    this.followers = this.followers.bind(this);
    this.setIntitalState = this.setIntitalState.bind(this);
    this.comment = this.comment.bind(this);
    this.checkForChanges = this.checkForChanges.bind(this);
    this.checkForOwnChanges = this.checkForOwnChanges.bind(this);
    this.client = Stitch.initializeDefaultAppClient("twitter-clone-hgeer");
    this.db = this.client
      .getServiceClient(RemoteMongoClient.factory, "mongodb-atlas")
      .db("test");
    this.user = this.client.auth.loginWithCredential(new AnonymousCredential());
  }

  state = {
    profilePicture: "logo.png",
    username: "",
    timesOfTweets: [],
    tweets: [],
    tweetValue: "",
    usernameValue: "",
    search: "",
    searchEmpty: true,
    searchResultsArray: [],
    following: [],
    followers: [],
    home: true,
    owner_id: ""
  };
  usernameInput(event) {
    this.setState({
      usernameValue: event.target.value
    });
  }
  usernameInputKeyHandler(event) {
    if (event.key === "Enter") {
      if (!event.target.value) {
        alert("name can't be empty");
      }
      this.setState({
        username: this.state.usernameValue
      });
      this.updateDb();
      console.log(this.client.auth.user.id);
      this.setState({
        owner_id: this.client.auth.user.id
      });
    }
  }

  handleTweetChange(event) {
    this.setState({
      tweetValue: event.target.value
    });
  }
  handleTweetKeyDown(event) {
    if (event.key === "Enter") {
      this.post();
    }
  }
  post() {
    if (this.state.tweetValue !== "") {
      let newTweet = this.state.tweets;
      let newTweetTime = this.state.timesOfTweets;
      let date = new Date();
      let time = date.getTime() / 1000;
      newTweetTime.unshift(time);
      newTweet.unshift(this.state.tweetValue);
      this.setState({
        tweets: newTweet,
        timesOfTweets: newTweetTime,
        tweetValue: ""
      });
      this.updateDb();
    }
  }
  updateDb() {
    this.db
      .collection("test")
      .updateOne(
        { owner_id: this.client.auth.user.id },
        {
          $set: {
            profilePicture: this.state.profilePicture,
            username: this.state.usernameValue || this.state.username,
            tweets: this.state.tweets,
            timesOfTweets: this.state.timesOfTweets,
            following: this.state.following,
            followers: this.state.followers
          }
        },
        { upsert: true }
      )
      .catch(err => {
        console.error(err);
      });
  }
  uploadPicture(info) {
    this.db
      .collection("test")
      .updateOne(
        { owner_id: this.client.auth.user.id },
        {
          $set: {
            profilePicture:
              "https://ucarecdn.com/" + info.uuid + "/-/resize/150x/"
          }
        },
        this.setState({
          profilePicture:
            "https://ucarecdn.com/" + info.uuid + "/-/resize/150x/"
        }),
        { upsert: true }
      )
      .catch(err => {
        console.error(err);
      });
  }

  getSearch(event) {
    if (event.target.value !== "") {
      this.setState({
        searchEmpty: false
      });
      this.searchResults(event.target.value);
    } else {
      this.setState({
        searchEmpty: true
      });
    }
    this.setState({
      search: event.target.value
    });
  }
  clearSearch() {
    this.setState({
      searchEmpty: true,
      search: ""
    });
  }
  searchResults(arg) {
    this.db
      .collection("test")
      .find({ username: new RegExp(arg, "i") })
      .toArray()
      .then(results => {
        if (results.length > 0) {
          this.setState({
            searchResultsArray: [...results]
          });
        }
      });
  }
  follow(item) {
    let newFollowing = this.state.following;
    newFollowing.push(item);
    this.setState({
      following: [...newFollowing]
    });
  }
  unfollow(item) {
    let newFollowing = this.state.following.filter(function(el) {
      return el.owner_id !== item.owner_id;
    });
    if (newFollowing.length === 0) {
      this.setState({
        following: []
      });
    }
    this.setState({
      following: [...newFollowing]
    });
  }
  followers() {
    let followers = [];
    console.log("followers");
    this.db
      .collection("test")
      .find({})
      .toArray()
      .then(results => {
        for (let i = 0; i < results.length; i++) {
          if (results[i].following.length > 0) {
            for (let j = 0; j < results[i].following.length; j++) {
              if (
                results[i].following[j].owner_id === this.client.auth.user.id
              ) {
                followers.push(results[i]);
              }
            }
          }
        }
        //console.log(followers, this.state.followers);
        for (let i = 0; i < followers.length; i++) {
          if (followers.length === this.state.followers.length) {
            if (
              followers[i].profilePicture !==
              this.state.followers[i].profilePicture
            ) {
              this.setState({
                followers: followers
              });
            }
          }
        }
        console.log(followers);
        if (followers.length !== this.state.followers.length) {
          this.setState({
            followers: followers
          });
        }
      });
  }
  setIntitalState() {
    this.user
      .then(() =>
        this.db
          .collection("test")
          .findOne({ owner_id: this.client.auth.user.id })
      )
      .then(docs => {
        if (docs) {
          this.setState({
            profilePicture: docs.profilePicture || "logo.png",
            tweets: docs.tweets,
            timesOfTweets: docs.timesOfTweets,
            username: docs.username,
            following: docs.following || [],
            followers: docs.followers || [],
            owner_id: docs.owner_id
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  comment(item, value, key) {
    if (key === 13 && value !== "") {
      this.db
        .collection("test")
        .findOne({ owner_id: item.owner_id })
        .then(docs => {
          let index = docs.timesOfTweets.indexOf(item.timesOfTweet);
          let tweets = docs.tweets;
          tweets[index] =
            tweets[index] +
            "&?" +
            value +
            " :" +
            "@" +
            this.state.username.toLowerCase().replace(/\s/g, "");
          this.db
            .collection("test")
            .updateOne(
              { owner_id: item.owner_id },
              {
                $set: {
                  tweets: tweets
                }
              },
              { upsert: true }
            )
            .catch(err => {
              console.error(err);
            });
          if (this.state.home) {
            console.log(this.state.tweets, tweets);
            this.setState({
              tweets: tweets
            });
          } else {
            this.updateDb();
            this.checkForChanges();
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
  checkForChanges() {
    let list = [];
    for (let i = 0; i < this.state.following.length; i++) {
      list.push(this.state.following[i].owner_id);
    }
    this.db
      .collection("test")
      .find({
        owner_id: {
          $in: list
        }
      })
      .toArray()
      .then(results => {
        let resultsSorted = results.sort((a, b) =>
          a.owner_id > b.owner_id ? 1 : b.owner_id > a.owner_id ? -1 : 0
        );
        let followingSorted = this.state.following.sort((a, b) =>
          a.owner_id > b.owner_id ? 1 : b.owner_id > a.owner_id ? -1 : 0
        );
        try {
          for (let i = 0; i < followingSorted.length; i++) {
            for (let j = 0; j < resultsSorted[i].tweets.length; j++) {
              if (
                resultsSorted[i].tweets[j] !== followingSorted[i].tweets[j] ||
                resultsSorted[i].profilePicture !==
                  followingSorted[i].profilePicture
              ) {
                this.setState({
                  following: resultsSorted
                });
                this.updateDb();
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      });
  }
  checkForOwnChanges() {
    if (this.state.username) {
      this.user
        .then(() =>
          this.db
            .collection("test")
            .findOne({ owner_id: this.client.auth.user.id })
        )
        .then(docs => {
          for (let i = 0; i < docs.tweets.length; i++) {
            if (docs.tweets[i] !== this.state.tweets[i]) {
              this.setState({
                tweets: docs.tweets
              });
              this.updateDb();
            } else break;
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
  componentDidMount() {
    this.setIntitalState();
    this.interval = setInterval(() => this.checkForChanges(), 2500);
    this.selfInterval = setInterval(() => this.checkForOwnChanges(), 2500);
    this.followersInterval = setInterval(() => this.followers(), 5000);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.following !== prevState.following) {
      this.updateDb();
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval, this.selfInterval, this.followersInterval);
  }
  render() {
    if (this.state.username === "") {
      return (
        <div className='login-container animation'>
          <div className='logo-container'>
            <img src='logo.png' alt='logo' />
          </div>
          <p>
            Welcome to Twudder (like a twitter, but with no annoying tweets)
          </p>
          <div className='username-input-container'>
            <input
              id='username-input'
              type='text'
              value={this.state.usernameValue}
              onChange={this.usernameInput}
              onKeyDown={this.usernameInputKeyHandler}
            />
            <label className='username-input-label' htmlFor='username-input'>
              Please enter your name and press Enter
            </label>
          </div>
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <div className='search-container'>
            <div className='search-input-container'>
              <input
                id='search'
                type='text'
                value={this.state.search}
                onChange={this.getSearch}
                placeholder='Search...'
              />
              <button onClick={this.clearSearch}>Clear</button>
            </div>
            {!this.state.searchEmpty ? (
              <SearchResults
                searchResultsArray={this.state.searchResultsArray}
                following={this.state.following}
                follow={this.follow}
                unfollow={this.unfollow}
              />
            ) : null}
          </div>
          <div className='container' onClick={() => this.clearSearch()}>
            <div className='profile-container'>
              <Profile
                profilePicture={this.state.profilePicture}
                username={this.state.username}
                usernameShort={
                  "@" + this.state.username.toLowerCase().replace(/\s/g, "")
                }
                tweetCounter={this.state.tweets.length}
                following={this.state.following}
                followers={this.state.followers}
                unfollow={this.unfollow}
              />
              <div className='uploader'>
                <label htmlFor='file'>Change Picture:</label>{" "}
                <Uploader
                  id='file'
                  name='file'
                  data-tabs='file camera'
                  onChange={file => {
                    console.log("File changed: ", file);
                    if (file) {
                      file.progress(info =>
                        console.log("File progress: ", info.progress)
                      );
                      file.done(info => console.log("File uploaded: ", info));
                    }
                  }}
                  onUploadComplete={info => this.uploadPicture(info)}
                />
              </div>
            </div>
            <div className='buttons-and-tweets'>
              <div className='buttons-container'>
                <button
                  className={this.state.home ? "button --active" : "button"}
                  onClick={() => this.setState({ home: true })}
                >
                  Home
                </button>
                <button
                  className={this.state.home ? "button" : "button --active"}
                  onClick={() => this.setState({ home: false })}
                >
                  Feed
                </button>
              </div>
              <div className='tweets-container'>
                {this.state.home ? (
                  <div className='post-container'>
                    <input
                      id='post'
                      type='text'
                      value={this.state.tweetValue}
                      onChange={this.handleTweetChange}
                      onKeyDown={this.handleTweetKeyDown}
                    />
                    <label className='post-label' htmlFor='post'>
                      Please enter your tweet and press Enter
                    </label>
                  </div>
                ) : null}

                {this.state.home ? (
                  <TweetBox
                    tweets={this.state.tweets}
                    timesOfTweets={this.state.timesOfTweets}
                    profilePicture={this.state.profilePicture}
                    usernameShort={
                      "@" + this.state.username.toLowerCase().replace(/\s/g, "")
                    }
                    comment={this.comment}
                    owner_id={this.state.owner_id}
                  />
                ) : (
                  <NewTweetBox
                    tweets={this.state.following}
                    comment={this.comment}
                  />
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}
export default App;
