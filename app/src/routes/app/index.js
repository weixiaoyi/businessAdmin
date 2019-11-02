import React, { Component } from "react";
import {
  Route,
  HashRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import routers from "../app-router-config/routers";
import { PATH } from "../../constants";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          {routers.map(item => (
            <Route
              key={item.path}
              path={item.path}
              exact
              render={props => <item.component {...props} />}
            />
          ))}
          <Redirect key={0} to={PATH.default} />
        </Switch>
      </Router>
    );
  }
}

export default App;
