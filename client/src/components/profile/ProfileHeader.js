import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from '../../validation/is-empty';


class ProfileHeader extends Component {
  render() {
    const { profile } = this.props;

    let socials = null;
    if (profile.social) {
      socials = Object.keys(profile.social).map((item, index) => (
        <a
          key={index}
          className="text-white p-2"
          href={profile.social[item]}
          target="_blank" rel="noopener noreferrer"
        >
          <i className={`fab fa-${item} fa-2x`} />
        </a>
      ));
    }

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-4 col-md-3 m-auto">
                <img
                  className="rounded-circle"
                  src={profile.user.avatar}
                  alt={profile.handle}
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">{profile.user.name}</h1>
              <p className="lead text-center">
                {profile.status}
                {!isEmpty(profile.company) && <span> at {profile.company}</span>}
              </p>
              <p>{!isEmpty(profile.location) && profile.location}</p>
              <p>

                {!isEmpty(profile.website) &&
                  <a
                    className="text-white p-2"
                    href={profile.website}
                    target="_blank" rel="noopener noreferrer"
                  >
                    <i className="fas fa-globe fa-2x" />
                  </a>
                }

                {socials}

              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


ProfileHeader.propTypes = {
  profile: PropTypes.object.isRequired
};


export default ProfileHeader;
