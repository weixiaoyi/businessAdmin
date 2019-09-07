import React, { Component } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import routers from "../app-router-config/routers";
import { PATH } from "../../constants";
import { GlobalUtils } from "../components";
import * as styles from "./index.module.scss";

class App extends Component {
  state = {
    visible: false
  };

  onClose = () => this.setState({ visible: false });

  render() {
    const { visible } = this.state;
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
        <div className={styles.utils}>
          <div
            className={styles.desc}
            onClick={() => {
              this.setState({
                visible: !visible
              });
            }}
          >
            App
          </div>
          <div style={{ display: visible ? "block" : "none" }}>
            <GlobalUtils onClose={this.onClose} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
