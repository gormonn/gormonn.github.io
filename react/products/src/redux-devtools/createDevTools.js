import React, { Children, Component } from "react";
import { connect } from "react-redux";
import instrument from "redux-devtools-instrument";
import withRedux from "./withRedux";

export default function createDevTools(children) {
  // console.log("createDevTools");

  const monitorElement = Children.only(children);
  const monitorProps = monitorElement.props;
  const Monitor = monitorElement.type;
  const mapStateToProps = (state) => {
    // console.log("mapStateToProps devtools");
    return state;
  };
  const ConnectedMonitor = withRedux(connect(mapStateToProps)(Monitor));

  class DevTools extends Component {
    render() {
      // console.log("render DevTools ");

      return <ConnectedMonitor {...monitorProps} />;
    }
  }

  DevTools.instrument = (options) =>
    instrument(
      (state, action) => Monitor.update(monitorProps, state, action),
      options
    );

  return DevTools;
}
