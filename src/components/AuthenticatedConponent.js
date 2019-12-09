import React, { Component } from "react";
import { getJwt, getID } from "../helper/jwt";
import axios from "axios";
import { withRouter } from "react-router-dom";

class AuthenticatedConponent extends Component {
  state = {
    user: ""
  };

  async componentDidMount() {
    const jwt = getJwt();
    const id = getID();
    if (!jwt) {
      this.props.history.push("./login");
    }
    await axios
      .get("https://mffood.herokuapp.com/api/users/" + id, {
        headers: {
          token: jwt
        }
      })
      .then(res => {
        //item storage phải ở trước setState
        localStorage.setItem("user", res.data.email);
        this.setState({
          user: res.data.email
        });
      })
      .catch(err => this.props.history.push("/login"));
  }

  render() {
    if (this.state.user === "") {
      return (
        <div>
          <h1>Loading...</h1>;
        </div>
      );
    }
    return <div>{this.props.children}</div>;
  }
}

export default withRouter(AuthenticatedConponent);
