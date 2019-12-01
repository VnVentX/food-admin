import React from "react";
import Home from "./Home";
import LoginComponent from "./LoginComponent";
import "antd/dist/antd.css";
import "../index.css";
import AutheticatedComponent from "./AuthenticatedConponent";
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={LoginComponent} />
        <AutheticatedComponent>
          <Route path="/" component={Home} />
        </AutheticatedComponent>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
