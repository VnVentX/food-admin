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
      .post("https://mffood.herokuapp.com/api/users/login?isGmail=false", {
        email: this.state.email,
        password: this.state.password
      })
      .then(res => {
        localStorage.setItem("token", res.data.tokenJWT);
        localStorage.setItem("id", res.data.idUser);
        localStorage.setItem("role", res.data.userRoleDTO);
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
          className="login-form"
          onSubmit={e => {
            this.onSubmit(e);
          }}
        >
          <h1>Food Admin</h1>
          <div className="txtb">
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={this.state.email}
              onChange={e => {
                this.onInputChange(e);
              }}
            />
          </div>

          <div className="txtb">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={this.state.password}
              onChange={e => {
                this.onInputChange(e);
              }}
            />
          </div>
          <input type="submit" className="logbtn" value="Login"></input>
        </form>
      </div>
    );
  }
}
