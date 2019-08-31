import React, { Component } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import routers from "../app-config/routers";
import { PATH } from "../app-constants";

class App extends Component {
  render() {
    return (
      <div className="App">
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
      </div>
    );
  }
}

export default App;
