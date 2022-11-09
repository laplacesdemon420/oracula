import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Header from './Header';

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Container>
      <Header />
      {children}
    </Container>
  );
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
`;
