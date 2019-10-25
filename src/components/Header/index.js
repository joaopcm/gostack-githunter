import React from 'react';
import { FaGithubAlt } from 'react-icons/fa';

import { Container } from './styles';

export default function Header() {
  return (
    <Container>
      <FaGithubAlt />
      <h1>GitHunter</h1>
    </Container>
  );
}
