import React from 'react';

import { EmptyContainer, EmptyAvatar, EmptyTitle } from './styles';

import emptyLogo from '../../assets/empty.png';

export default function Empty() {
  return (
    <EmptyContainer>
      <EmptyAvatar source={emptyLogo} />
      <EmptyTitle>Looks like the box is empty</EmptyTitle>
    </EmptyContainer>
  );
}
