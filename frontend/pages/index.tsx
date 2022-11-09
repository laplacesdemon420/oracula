import type { NextPage } from 'next';
import Link from 'next/link';
import styled from 'styled-components';
import AskQuestion from '../components/AskQuestion';
import Table, { LightTable } from '../components/QuestionsTable';

const Home: NextPage = () => {
  return (
    <Container>
      <TopContainer>
        <Top>
          <Left>
            <h1>
              The oracle for everything. Secure your smart contracts on BTTC
              today.
            </h1>
            <p className="description">
              Oracula is a optimistic oracle, designed to provide answers to any
              binary question with the help of game theory. Anyone that holds
              the Oracula token can and is incentivized to report the answer to
              a question, and in the case of disputes, there is a vote.
            </p>
            <div className="buttons">
              <Link href="/questions">
                <PrimaryButton>
                  <a>Questions</a>
                </PrimaryButton>
              </Link>
              <Link href="/faucet">
                <SecondaryButton>
                  <a>Faucet</a>
                </SecondaryButton>
              </Link>
            </div>
          </Left>
          <Right>
            <LightTable></LightTable>
          </Right>
        </Top>
      </TopContainer>
      <Middle>
        <AskQuestion></AskQuestion>
      </Middle>
    </Container>
  );
};

const Container = styled.div`
  color: ${({ theme }) => theme.text.primary};
`;

const TopContainer = styled.div`
  padding: 5rem 4rem;
  border-bottom: 2px solid ${({ theme }) => theme.background.tertiary};
`;

const Top = styled.div`
  display: flex;
  gap: 3rem;
`;

const Middle = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  padding-bottom: 4rem;
`;

const Left = styled.div`
  flex-basis: 45%;
  /* align-self: center; */
  margin-top: 6rem;

  display: flex;
  flex-direction: column;
  gap: 2rem;

  h1 {
    font-size: 2.5rem;
  }

  .description {
    font-size: 1.1rem;
    line-height: 1.35;
  }

  .buttons {
    display: flex;
    gap: 1rem;
  }
`;

const Right = styled.div`
  flex-basis: 55%;
`;

const PrimaryButton = styled.button`
  margin-top: 0.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.background.primary};
  padding: 0.75rem 1.75rem;
  border-radius: 10px;
  font-size: ${({ theme }) => theme.typeScale.header6};
  font-weight: 600;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SecondaryButton = styled.button`
  margin-top: 0.5rem;
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  padding: 0.75rem 1.75rem;
  border-radius: 10px;
  font-size: ${({ theme }) => theme.typeScale.header6};
  font-weight: 600;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    border: 2px solid ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.background.primary};
  }
`;

export default Home;
