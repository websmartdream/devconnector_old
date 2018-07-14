import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';


class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      errors: {}
    };
  }

  componentDidMount = () => {
    if (this.props.auth.isAuthenticated) this.props.history.push('/dashboard');
  }

  static getDerivedStateFromProps(props, state) {
    if (props.auth.isAuthenticated) props.history.push('/dashboard');
    if (props.errors) return { errors: props.errors };
    return null;
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    }

    this.props.loginUser(user);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your DevConnector account
              </p>
              <form noValidate onSubmit={this.onSubmit}>

                <TextFieldGroup
                  type="email"
                  placeholder="Email address"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />

                <TextFieldGroup
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />

                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


Login.propTypes = {
  history: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};


const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});


export default connect(mapStateToProps, { loginUser })(Login);
