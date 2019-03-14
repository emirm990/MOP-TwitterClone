import React, { Component } from "react";
import Profile from "./components/Profile.js";
import TweetBox from "./components/TweetBox.js";
import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential
} from "mongodb-stitch-browser-sdk";
import {
  Image,
  Video,
  Transformation,
  CloudinaryContext
} from "cloudinary-react";

import "./styles/app.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.post = this.post.bind(this);

    this.client = Stitch.initializeDefaultAppClient("twitter-clone-hgeer");

    this.db = this.client
      .getServiceClient(RemoteMongoClient.factory, "mongodb-atlas")
      .db("twitter-clone");
    this.user = this.client.auth.loginWithCredential(new AnonymousCredential());
  }
  state = {
    profilePicture: "https://via.placeholder.com/100",
    username: "Emir Mekić",
    usernameShort: "emirmekic",
    tweets: [],
    value: "",
    tweetCounter: 0
  };
  handleChange(event) {
    console.log(event.target.value);
    this.setState({
      value: event.target.value
    });
  }
  handleKeyDown(event) {
    if (event.key === "Enter") {
      this.post();
    }
  }
  post() {
    if (this.state.value !== "") {
      let newTweet = this.state.tweets;
      newTweet.push(this.state.value);
      this.setState({
        tweets: newTweet,
        tweetCounter: this.state.tweets.length,
        value: ""
      });
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
                value: this.state.value,
                tweetCounter: this.state.tweetCounter
              }
            },
            { upsert: true }
          )
          .then(() =>
            this.db
              .collection("users")
              .findOne({ owner_id: this.client.auth.user.id })
          )
          .then(docs => {
            console.log("Found docs", docs);
            console.log("[MongoDB Stitch] Connected to Stitch");
            this.setState({
              docs
            });
          })
          .catch(err => {
            console.error(err);
          })
      );
    }
  }

  componentDidMount() {
    this.user
      .then(() =>
        this.db
          .collection("users")
          .findOne({ owner_id: this.client.auth.user.id })
      )
      .then(docs => {
        console.log("Found docs", docs);
        console.log("[MongoDB Stitch] Connected to Stitch");

        this.setState({
          profilePicture: docs.profilePicture,
          tweetCounter: docs.tweetCounter,
          tweets: docs.tweets,
          username: docs.username,
          usernameShort: docs.usernameShort,
          value: docs.value
        });
      })
      .catch(err => {
        console.error(err);
      });
  }
  render() {
    return (
      <div className='container'>
        <Profile
          profilePicture={this.state.profilePicture}
          username={this.state.username}
          usernameShort={this.state.usernameShort}
          tweetCounter={this.state.tweetCounter}
        />
        <div className='tweets-container'>
          <div className='post-container'>
            <input
              id='post'
              type='text'
              placeholder='Please enter your tweet and press Enter'
              value={this.state.value}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
            />
          </div>
          <TweetBox
            tweets={this.state.tweets}
            usernameShort={this.state.usernameShort}
            profilePicture={this.state.profilePicture}
          />
        </div>
      </div>
    );
  }
}

export default App;
