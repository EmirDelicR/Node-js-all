import React, { Component } from "react";

import Image from "../../../components/Image/Image";
import "./SinglePost.css";
import {
  setAuthorization,
  setServerConfigJSON
} from "../../../util/serverConfig";

class SinglePost extends Component {
  state = {
    title: "",
    author: "",
    date: "",
    image: "",
    content: ""
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;

    const queryData = {
      query: `
        query FetchPost($postId: ID!) {
        post(id: $postId){
          title
          content
          imageUrl
          creator {
            name
          }
          createdAt
        }
      }`,
      variables: {
        postId: postId
      }
    };

    const config = setServerConfigJSON(queryData);
    const auth = setAuthorization(this.props.token);
    config.headers = Object.assign(config.headers, auth.headers);

    fetch(process.env.REACT_APP_GRAPHQL_ROUTE, config)
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          throw new Error("Fetching post failed!");
        }

        this.setState({
          title: resData.data.post.title,
          author: resData.data.post.creator.name,
          image:
            process.env.REACT_APP_DOMAIN + `/${resData.data.post.imageUrl}`,
          date: new Date(resData.data.post.createdAt).toLocaleDateString(
            "en-US"
          ),
          content: resData.data.post.content
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
