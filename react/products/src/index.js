import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { store } from "./reducers";
import App from "./App";
import DevTools from "./DevTools";

const rootElement = document.getElementById("root");
ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
    <DevTools />
  </Provider>,
  // </React.StrictMode>,
  rootElement
);
