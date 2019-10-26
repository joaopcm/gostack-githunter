import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

import api from '../../services/api';

import { Form, SubmitButton, List } from './styles';
import Card from '../../components/Card';
import CardHeader from '../../components/CardHeader';
import Container from '../../components/Container';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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

    try {
      const repositoryAlreadyExists = repositories.find(
        repository => repository.name.toLowerCase() === newRepo.toLowerCase()
      );

      if (repositoryAlreadyExists) {
        throw new Error('This repository is already in your watchlist');
      }

      const response = await api.get(`/repos/${newRepo}`);

      if (response && response.data) {
        const data = {
          name: response.data.full_name,
        };

        setRepositories([...repositories, data]);
      }

      setError(false);
    } catch (e) {
      const finalError = e.response ? e.response.data.message : e;

      toast.error(String(finalError));
      setError(true);
    }

    setNewRepo('');
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <h1>Repositories</h1>
      </CardHeader>

      <Container>
        <Form onSubmit={event => handleSubmit(event)} error={error}>
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
