import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

import api from '../../services/api';

import {
  LoadingIndicator,
  Owner,
  IssueList,
  Filters,
  LoadMoreButton,
} from './styles';
import Card from '../../components/Card';
import CardHeader from '../../components/CardHeader';
import Container from '../../components/Container';

function Repository({ match }) {
  const [firstLoading, setFirstLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [repository, setRepository] = useState([]);
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const repositoryName = decodeURIComponent(match.params.repository);

  async function loadRepositoryData() {
    const [repositoryFromApi, issuesFromApi] = await Promise.all([
      api.get(`/repos/${repositoryName}`),
      api.get(`/repos/${repositoryName}/issues`, {
        params: {
          state: filter,
          per_page: 10,
        },
      }),
    ]);

    setRepository(repositoryFromApi.data);
    setIssues(issuesFromApi.data);
    setFirstLoading(false);
  }

  useEffect(() => {
    async function loadRepository() {
      await loadRepositoryData();
    }

    loadRepository();
    // eslint-disable-next-line
  }, []);

  async function loadIssuesData() {
    setLoading(true);

    try {
      const response = await api.get(`/repos/${repositoryName}/issues`, {
        params: {
          state: filter,
          per_page: 10,
        },
      });

      setIssues(response.data);
    } catch (error) {
      const finalError = error.response ? error.response.data.message : error;

      toast.error(String(finalError));
    }

    setLoading(false);
  }

  useEffect(() => {
    async function loadIssues() {
      await loadIssuesData();
    }

    loadIssues();
    // eslint-disable-next-line
  }, [filter]);

  async function loadIssuesPageData() {
    setLoading(true);

    try {
      const response = await api.get(`/repos/${repositoryName}/issues`, {
        params: {
          state: filter,
          per_page: 10,
          page,
        },
      });

      setIssues([...issues, ...response.data]);
    } catch (error) {
      const finalError = error.response ? error.response.data.message : error;

      toast.error(String(finalError));
    }

    setLoading(false);
  }

  useEffect(() => {
    async function loadIssuesPage() {
      await loadIssuesPageData();
    }

    loadIssuesPage();
    // eslint-disable-next-line
  }, [page]);

  if (firstLoading) {
    return <LoadingIndicator>Loading...</LoadingIndicator>;
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
          <p>{repository.description || 'No description here'}</p>
        </Owner>

        {issues.length > 0 ? (
          <IssueList>
            <Filters>
              <span>Filter by</span>
              <div>
                <select
                  disabled={loading ? 1 : 0}
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </Filters>

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
                  <p>
                    {issue.user.login} - {issue.state}
                  </p>
                </div>
              </li>
            ))}
            <li>
              <LoadMoreButton
                onClick={() => setPage(page + 1)}
                loading={loading ? 1 : 0}
              >
                {loading ? <FaSpinner color="#fff" size={14} /> : 'Load more'}
              </LoadMoreButton>
            </li>
          </IssueList>
        ) : (
          false
        )}
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
