import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  const router = useRouter();
  const page =
    router.asPath === '/dashboard'
      ? 'dashboard'
      : router.asPath === '/questions'
      ? 'questions'
      : router.asPath === '/faucet'
      ? 'faucet'
      : '';

  return (
    <Container>
      <LogoContainer>
        <Link href="/">
          <a>Oracula</a>
        </Link>
      </LogoContainer>
      <MenuContainer>
        <Link href="/questions">
          <Choice clicked={page === 'questions'}>QUESTIONS</Choice>
        </Link>
        <Link href="/faucet">
          <Choice clicked={page === 'faucet'}>FAUCET</Choice>
        </Link>
      </MenuContainer>
      <ButtonContainer>
        <ConnectButton
          chainStatus="icon"
          accountStatus="address"
          showBalance={false}
        />
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.75rem 1.5rem;
  /* align-items: center; */
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: flex-end;
  background-color: ${({ theme }) => theme.background.primary};
  /* border-bottom: 1px solid ${({ theme }) => theme.background.secondary}; */
  color: ${({ theme }) => theme.text.primary};
`;

const LogoContainer = styled.div`
  a {
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.typeScale.header2};
    font-weight: 700;
  }
  :hover {
    cursor: pointer;
  }
`;
const MenuContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-self: center;
  align-items: flex-end;
`;

const Choice = styled.a<{ clicked: boolean }>`
  font-weight: 500;
  padding-bottom: 5px;
  border-bottom: ${({ clicked, theme }) =>
    clicked
      ? '3px solid ' + theme.text.primary
      : '3px solid ' + theme.background.primary};

  :hover {
    cursor: pointer;
    border-bottom: ${({ clicked, theme }) =>
      clicked
        ? '3px solid ' + theme.text.primary
        : '3px solid ' + theme.colors.secondary};
  }
`;

const ButtonContainer = styled.div`
  justify-self: end;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.background.primary};
  padding: 0.5rem 1.75rem;
  border-radius: 5px;
  font-size: ${({ theme }) => theme.typeScale.header6};
  font-weight: 600;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;
