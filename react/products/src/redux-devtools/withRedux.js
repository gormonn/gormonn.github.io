import React, { Component } from "react";
import { ReactReduxContext } from "react-redux";

export default function withRedux(WrappedComponent) {
  class WithRedux extends Component {
    render() {
      // console.log("withRedux devtools");
      return (
        <ReactReduxContext.Consumer>
          {({ store, ...reduxContext }) => {
            // console.log(store.liftedStore.getState());

            return (
              <ReactReduxContext.Provider
                value={{
                  store: store.liftedStore,
                  storeState: store.liftedStore.getState()
                }}
              >
                <WrappedComponent {...this.props} />
              </ReactReduxContext.Provider>
            );
          }}
        </ReactReduxContext.Consumer>
      );
    }
  }

  return WithRedux;
}
