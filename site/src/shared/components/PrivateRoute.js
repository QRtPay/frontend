import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { Redirect } from "react-router";
import Cookies from "js-cookie";

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
};

/**
 * Wrapper around the Router component, which makes it pass the properties
 * to it's child.
 * Taken from https://github.com/ReactTraining/react-router/issues/4105
 */
const PrivateRoute = ({ component, redirectTo, ...rest }) => (
  <Route {...rest} render={routeProps => {
    return localStorage.getItem('auth_token') != undefined ? (
      renderMergedProps(component, routeProps, rest)
    ) : (
      <Redirect to={{
        pathname: redirectTo,
        state: { from: routeProps.location }
      }}/>
    );
  }}/>
);

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node])
};

export default PrivateRoute;
