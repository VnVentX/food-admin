import React, { Component } from "react";
import { getJwt } from "../helper/jwt";
import axios from "axios";
import { withRouter } from "react-router-dom";

class AuthenticatedConponent extends Component {
  state = {
    user: ""
  };

  componentDidMount() {
    const jwt = getJwt();
    if (!jwt) {
      this.props.history.push("./login");
    }
    axios
      .get("http://localhost:8080/ETutor/api/account", {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      })
      .then(res => {
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
