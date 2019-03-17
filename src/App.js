import React, { Component } from "react";
import Profile from "./components/Profile.js";
import TweetBox from "./components/TweetBox.js";
import Uploader from "./components/Uploader";
import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential
} from "mongodb-stitch-browser-sdk";
import "./styles/app.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleTweetChange = this.handleTweetChange.bind(this);
    this.handleTweetKeyDown = this.handleTweetKeyDown.bind(this);
    this.post = this.post.bind(this);
    this.usernameInput = this.usernameInput.bind(this);
    this.usernameInputKeyHandler = this.usernameInputKeyHandler.bind(this);
    this.client = Stitch.initializeDefaultAppClient("twitter-clone-hgeer");
    this.db = this.client
      .getServiceClient(RemoteMongoClient.factory, "mongodb-atlas")
      .db("twitter-clone");
    this.user = this.client.auth.loginWithCredential(new AnonymousCredential());
  }

  state = {
    profilePicture: "logo.png",
    username: "",
    usernameShort: "",
    tweets: [],
    timesOfTweets: [],
    tweetValue: "",
    usernameValue: "",
    tweetCounter: 0
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
        username: this.state.usernameValue,
        usernameShort: this.state.usernameValue.toLowerCase().replace(/\s/g, "")
      });
      this.postTweetAndUpdateDb();
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
        tweetCounter: this.state.tweets.length,
        tweetValue: ""
      });
      this.postTweetAndUpdateDb();
    }
  }
  postTweetAndUpdateDb() {
    this.user.then(user =>
      this.db
        .collection("users")
        .updateOne(
          { owner_id: this.client.auth.user.id },
          {
            $set: {
              profilePicture: this.state.profilePicture,
              username: this.state.username,
              usernameShort: this.state.usernameShort,
              tweets: this.state.tweets,
              timesOfTweets: this.state.timesOfTweets,
              tweetCounter: this.state.tweetCounter
            }
          },
          { upsert: true }
        )
        .catch(err => {
          console.error(err);
        })
    );
  }
  uploadPicture(info) {
    this.user.then(user =>
      this.db
        .collection("users")
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
        })
    );
  }
  setIntitalState() {
    this.user
      .then(() =>
        this.db
          .collection("users")
          .findOne({ owner_id: this.client.auth.user.id })
      )
      .then(docs => {
        if (docs) {
          this.setState({
            profilePicture: docs.profilePicture || "logo.png",
            tweetCounter: docs.tweetCounter,
            tweets: docs.tweets,
            timesOfTweets: docs.timesOfTweets,
            username: docs.username,
            usernameShort: docs.usernameShort
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  componentDidMount() {
    this.setIntitalState();
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
          <input
            id='username-input'
            type='text'
            placeholder='Please enter your name and press Enter'
            value={this.state.usernameValue}
            onChange={this.usernameInput}
            onKeyDown={this.usernameInputKeyHandler}
          />
        </div>
      );
    } else {
      return (
        <div className='container'>
          <div className='profile-container'>
            <Profile
              profilePicture={this.state.profilePicture}
              username={this.state.username}
              usernameShort={this.state.usernameShort}
              tweetCounter={this.state.tweetCounter}
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
          <div className='tweets-container'>
            <div className='post-container'>
              <input
                id='post'
                type='text'
                placeholder='Please enter your tweet and press Enter'
                value={this.state.tweetValue}
                onChange={this.handleTweetChange}
                onKeyDown={this.handleTweetKeyDown}
              />
            </div>
            <TweetBox
              tweets={this.state.tweets}
              timesOfTweets={this.state.timesOfTweets}
              usernameShort={this.state.usernameShort}
              profilePicture={this.state.profilePicture}
            />
          </div>
        </div>
      );
    }
  }
}

export default App;
