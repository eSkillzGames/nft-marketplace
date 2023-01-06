import { injectReducer } from "./store";
import React from "react";

const withReducer = (key, reducer) => (WrappedComponent) =>
  // eslint-disable-next-line react/display-name
  class extends React.PureComponent {
    constructor(props) {
      super(props);
      injectReducer(key, reducer);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

export default withReducer;
