import styled from 'styled-components';

export default function Header() {
  return (
    <Container>
      <LogoContainer>
        <p>opti.xyz</p>
      </LogoContainer>
      <MenuContainer>
        <p>DASHBOARD</p>
        <p>QUESTIONS</p>
        <p>DISPUTES</p>
      </MenuContainer>
      <ButtonContainer>
        <Button>Connect</Button>
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.div`
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.background.secondary};
`;

const LogoContainer = styled.div`
  p {
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.typeScale.header2};
    font-weight: 700;
  }
`;
const MenuContainer = styled.div`
  display: flex;
  font-weight: 600;
  gap: 3rem;
`;
const ButtonContainer = styled.div``;

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
