import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import { LoadingIndicator, Owner, IssueList } from './styles';
import Card from '../../components/Card';
import CardHeader from '../../components/CardHeader';
import Container from '../../components/Container';

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
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <LoadingIndicator>Carregando...</LoadingIndicator>;
  }

  return (
    <Card>
      <CardHeader>
        <h1>{repository.full_name}</h1>
      </CardHeader>
      <Container>
        <Owner>
          <Link to="/">Back to repositories</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url} target="__blank">
                    {issue.title}
                  </a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
      </Container>
    </Card>
  );
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};

export default Repository;
