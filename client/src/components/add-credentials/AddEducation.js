import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addEducation } from '../../actions/profileActions';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';


class AddExperience extends Component {
  constructor() {
    super();

    this.state = {
      school: '',
      degree: '',
      fieldofstudy: '',
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

    const eduData = {
      school: this.state.school,
      degree: this.state.degree,
      fieldofstudy: this.state.fieldofstudy,
      from: this.state.from,
      to: this.state.to,
      current: this.state.current,
      description: this.state.description
    };

    this.props.addEducation(eduData, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="add-education">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">Go back</Link>
              <div className="display-4 text-center">Add education</div>
              <p className="lead text-center">Add any school, bootcamp, etc that you have attended</p>
              <small className="d-block pb-3">* = required fields</small>
              <form onSubmit={this.onSubmit}>

                <TextFieldGroup
                  placeholder="* School"
                  name="school"
                  value={this.state.school}
                  onChange={this.onChange}
                  error={errors.school}
                />

                <TextFieldGroup
                  placeholder="* Degree or certification"
                  name="degree"
                  value={this.state.degree}
                  onChange={this.onChange}
                  error={errors.degree}
                />

                <TextFieldGroup
                  placeholder="* Field of study"
                  name="fieldofstudy"
                  value={this.state.fieldofstudy}
                  onChange={this.onChange}
                  error={errors.fieldofstudy}
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
                  <label htmlFor="current" className="form-check-label ml-2">Current study</label>
                </div>

                <TextAreaFieldGroup
                  placeholder="Program description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                  info="Tell us about the program that you were in"
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
  addEducation: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors
});


export default connect(mapStateToProps, { addEducation })(withRouter(AddExperience));
