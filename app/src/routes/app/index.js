import React, { Component } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import routers from "../app-router-config/routers";
import { PATH } from "../../constants";
import { GlobalUtils, GlobalUtilsQuick } from "../components";
import * as styles from "./index.module.scss";

class Main extends Component {
  state = {
    visible: false
  };

  onClose = () => this.setState({ visible: false });

  render() {
    const { visible } = this.state;
    return (
      <div className="App">
        <div className={styles.layout}>
          <div className={styles.leftSidebar}>
            <GlobalUtilsQuick />
          </div>
          <div className={styles.content}>
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
        </div>
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

class Blank extends Component {
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

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/blank/(.*)?" render={props => <Blank {...props} />} />
          <Route path="/" render={props => <Main {...props} />} />
        </Switch>
      </Router>
    );
  }
}

export default App;
