import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addExperience } from '../../actions/profileActions';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';


class AddExperience extends Component {
  constructor() {
    super();

    this.state = {
      company: '',
      title: '',
      location: '',
      from: '',
      to: '',
      current: false,
      description: '',
      errors: {},
      disabled: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.errors) return { errors: nextProps.errors };
    return null;
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onCheck = (e) => {
    this.setState({
      current: !this.state.current,
      disabled: !this.state.disabled
    });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const expData = {
      company: this.state.company,
      title: this.state.title,
      location: this.state.location,
      from: this.state.from,
      to: this.state.to,
      current: this.state.current,
      description: this.state.description
    };

    this.props.addExperience(expData, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="add-experience">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">Go back</Link>
              <div className="display-4 text-center">Add experience</div>
              <p className="lead text-center">Add any job or position that you have had in the past or current</p>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>

                <TextFieldGroup
                  placeholder="* Company"
                  name="company"
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.company}
                />

                <TextFieldGroup
                  placeholder="* Job title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                />

                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                />

                <h6>From date</h6>
                <TextFieldGroup
                  type="date"
                  name="from"
                  value={this.state.from}
                  onChange={this.onChange}
                  error={errors.from}
                />

                <h6>To date</h6>
                <TextFieldGroup
                  type="date"
                  name="to"
                  value={this.state.to}
                  onChange={this.onChange}
                  error={errors.to}
                  disabled={this.state.disabled ? 'disabled' : ''}
                />

                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    className="from-check-input"
                    name="current"
                    value={this.state.current}
                    checked={this.state.current}
                    onChange={this.onCheck}
                    id="current"
                  />
                  <label htmlFor="current" className="form-check-label ml-2">Current job</label>
                </div>

                <TextAreaFieldGroup
                  placeholder="Job description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                  info="Tell us about the position"
                />

                <input type="submit" className="btn btn-info btn-block mt-4"/>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


AddExperience.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addExperience: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors
});


export default connect(mapStateToProps, { addExperience })(withRouter(AddExperience));
