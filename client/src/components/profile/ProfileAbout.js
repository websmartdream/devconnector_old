import React, { Component } from 'react';
import PropTypes from 'prop-types';


class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;

    const firstName = profile.user.name.trim().split(' ').shift();

    const skillSet = profile.skills.map((item, index) => (
      <div className="p-3" key={index}>
        <i className="fa fa-check mr-2" />
        {item}
      </div>
    ));

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            {profile.bio && (
              <div>
                <h3 className="text-center text-info">{`${firstName}'s Bio`}</h3>
                <p className="lead text-center">
                  {profile.bio}
                </p>
                <hr />
              </div>
            )}
            <h3 className="text-center text-info">Skill Set</h3>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                {skillSet}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};


export default ProfileAbout;
