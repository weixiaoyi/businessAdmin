import React, { Component } from "react";
import {
  Route,
  HashRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import routers from "../app-router-config/routers";
import { PATH } from "../../constants";
import { Inject } from "../../utils";

@Inject(({ globalStore }) => ({
  globalStore
}))
class App extends Component {
  componentDidMount() {
    const {
      globalStore: { dispatch }
    } = this.props;

    dispatch({
      type: "ipc-globalConfig"
    });
  }
  render() {
    const {
      globalStore: {
        globalConfigs: { status }
      }
    } = this.props;
    return status ? (
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
    ) : (
      <div>初始化配置中</div>
    );
  }
}

export default App;
