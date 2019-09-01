import React from "react";
import ReactDOM from "react-dom";
import App from "./routes/app";
import "antd/dist/antd.css";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));
serviceWorker.unregister();
