import React, { Component } from "react";
import axios from "axios";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: ""
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = async e => {
    e.preventDefault();
    await axios
      .post("http://localhost:8080/ETutor/api/auth/signin", {
        email: this.state.email,
        password: this.state.password
      })
      .then(res => {
        localStorage.setItem("token", res.data.accessToken);
        //Test Role
        localStorage.setItem("role", "ROLE_ADMIN");
        this.props.history.push("/order");
      })
      .catch(e => {
        console.log(e);
      });
  };

  onInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <div>
        <form
          onSubmit={e => {
            this.onSubmit(e);
          }}
        >
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={this.state.email}
            onChange={e => {
              this.onInputChange(e);
            }}
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={e => {
              this.onInputChange(e);
            }}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}
