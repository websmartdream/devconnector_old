import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render = {props =>
      auth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);


PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});


export default connect(mapStateToProps)(PrivateRoute);
