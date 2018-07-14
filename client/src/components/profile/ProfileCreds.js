import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import isEmpty from '../../validation/is-empty';


class ProfileCreds extends Component {
  render() {
    const { experience, education } = this.props;

    let expItems = experience.map(exp => (
      <li className="list-group-item" key={exp._id}>
        <h4>{exp.company}</h4>
        <p>
          <Moment format="YYYY/MM/DD">{exp.from}</Moment>
          {' - '}
          {exp.to ?
            <Moment format="YYYY/MM/DD">{exp.to}</Moment> : 'Now'
          }
        </p>
        <p><strong>Position: </strong>{exp.title}</p>
        <div>
          {!isEmpty(exp.location) &&
            <p><strong>Location: </strong>{exp.location}</p>
          }
          {!isEmpty(exp.description) &&
            <p><strong>Description: </strong>{exp.description}</p>
          }
        </div>
      </li>
    ));

    let eduItems = education.map(edu => (
      <li className="list-group-item" key={edu._id}>
        <h4>{edu.school}</h4>
        <p>
          <Moment format="YYYY/MM/DD">{edu.from}</Moment>
          {' - '}
          {edu.to ?
            <Moment format="YYYY/MM/DD">{edu.to}</Moment> : 'Now'
          }
        </p>
        <p><strong>Degree: </strong>{edu.degree}</p>
        <div>
          <p><strong>Field Of Study: </strong>{edu.fieldofstudy}</p>
          {!isEmpty(edu.description) &&
            <p><strong>Description: </strong>{edu.description}</p>
          }
        </div>
      </li>
    ));

    return (
      <div className="row">
        {!isEmpty(experience) &&
          <div className="col-md-6">
            <h3 className="text-center text-info">Experience</h3>
            <ul className="list-group">
              {expItems}
            </ul>
          </div>
        }
        {!isEmpty(education) &&
          <div className="col-md-6">
            <h3 className="text-center text-info">Education</h3>
            <ul className="list-group">
              {eduItems}
            </ul>
          </div>
        }
      </div>
    );
  }
}


ProfileCreds.propTypes = {
  experience: PropTypes.array.isRequired,
  education: PropTypes.array.isRequired
};


export default ProfileCreds;
