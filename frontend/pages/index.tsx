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
              The oracle for everything. Secure your smart contracts on Aurora
              today.
            </h1>
            <p className="description">
              Opti is a optimistic oracle, designed to provide answers to any
              binary question with the help of game theory. Anyone that holds
              OPTI can and is incentivized to report the answer to a question,
              and in the case of disputes, there is a vote.
            </p>
            <div className="buttons">
              <Link href="/dashboard">
                <PrimaryButton>
                  <a>Dashboard</a>
                </PrimaryButton>
              </Link>
              <Link href="/questions">
                <SecondaryButton>
                  <a>Questions</a>
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
      <Bottom>
        <div className="header">
          <p>Introducing the Optimistic Oracle</p>
        </div>
        <div className="largebox">
          <div className="box">
            <p className="header">Pull-based Oracle</p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illo
              culpa quasi quas. Beatae, porro ad praesentium aliquam molestias
              aliquid non eligendi temporibus tempora eveniet? Sint nobis
              explicabo placeat ex molestias!
            </p>
          </div>
          <div className="box">
            <p className="header">How does it work?</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
              quos cum nulla, aliquam, suscipit eaque placeat iure quas,
              doloremque sunt amet et blanditiis ducimus enim quae? Tempore,
              recusandae et? Illo?
            </p>
          </div>
          <div className="box">
            <p className="header">Participant in Near Hackathon</p>
            <p>
              Opti is currently participating in the Near Metabuild III
              Hackathon. A link to our devpost submission can be found at{' '}
              <a href="https://devpost.com" target="_blank" rel="noreferrer">
                devpost.com
              </a>
              . There you can find a video that explains the project more
              in-depth.
            </p>
          </div>
        </div>
      </Bottom>
    </Container>
  );
};

const Container = styled.div`
  color: ${({ theme }) => theme.text.primary};
`;

const TopContainer = styled.div`
  padding: 3rem 4rem;
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

const Bottom = styled.div`
  padding: 0 2rem;
  background-color: ${({ theme }) => theme.background.secondary};
  height: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  .header {
    width: 100%;
    max-width: 1200px;
    p {
      color: ${({ theme }) => theme.colors.primary};
      padding-top: 2rem;
      font-size: ${({ theme }) => theme.typeScale.header1};
      font-weight: 500;
    }
  }
  .largebox {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
    overflow-y: scroll;
    .box {
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      line-height: 1.5rem;
      .header {
        font-size: ${({ theme }) => theme.typeScale.header4};
        font-weight: 500;
      }
      a {
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
`;

export default Home;
