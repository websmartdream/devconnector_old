import React, { Component } from 'react'
import PropTypes from 'prop-types';


class ProfileGithub extends Component {
  constructor() {
    super();

    this.state = {
      clientId: '0de9c6f40e425145cb55',
      clientSecret: 'bc567e2131d6d2df6ce3d9666c7bcc8556236e5b',
      count: 5,
      sort: 'created: asc',
      repos: []
    };
  }

  componentDidMount() {
    const { username } = this.props;
    const { clientId, clientSecret, count, sort } = this.state;

    fetch(`https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}
    &client_id=${clientId}&client_secret=${clientSecret}`)
      .then(res => res.json())
      .then(res => {
        if (!this.isCancelled) this.setState({ repos: res });
      });
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  render() {
    const repoItems = this.state.repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-8">
            <h4>
              <a href={repo.html_url} className="text-info" target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-4">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-success">
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ));

    return (
      <div>
        <hr />
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    )
  }
}


ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired
};


export default ProfileGithub;
