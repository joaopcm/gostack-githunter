import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import { LoadingIndicator } from './styles';

function Repository({ match }) {
  const [loading, setLoading] = useState(true);
  const [repository, setRepository] = useState([]);
  const [issues, setIssues] = useState([]);

  async function loadRepositoryData() {
    const repositoryName = decodeURIComponent(match.params.repository);

    const [repositoryFromApi, issuesFromApi] = await Promise.all([
      api.get(`/repos/${repositoryName}`),
      api.get(`/repos/${repositoryName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ]);

    setRepository(repositoryFromApi.data);
    setIssues(issuesFromApi.data);
    setLoading(false);
  }

  useEffect(() => {
    async function laodRepository() {
      await loadRepositoryData();
    }

    laodRepository();
  }, []);

  return <h1>Repository</h1>;
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};

export default Repository;
