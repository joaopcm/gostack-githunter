import React, { useState, useEffect } from 'react';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import { Card, Form, SubmitButton, Header, Container, List } from './styles';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const repositoriesFromLocalStorage = localStorage.getItem('repositories');

    if (repositoriesFromLocalStorage) {
      setRepositories(JSON.parse(repositoriesFromLocalStorage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);

    const response = await api
      .get(`/repos/${newRepo}`)
      .catch(() => setLoading(false));

    if (response && response.data) {
      const data = {
        name: response.data.full_name,
      };

      setRepositories([...repositories, data]);
    }

    setNewRepo('');
    setLoading(false);
  }

  return (
    <Card>
      <Header>
        <h1>Repositories</h1>
      </Header>

      <Container>
        <Form onSubmit={event => handleSubmit(event)}>
          <input
            type="text"
            placeholder="Add a repo (e.g. rocketseat/unform)"
            value={newRepo}
            onChange={event => setNewRepo(event.target.value)}
          />
          <SubmitButton loading={loading ? 1 : 0}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    </Card>
  );
}
