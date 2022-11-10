import type { NextPage } from 'next';
import styled from 'styled-components';
import Question from '../../components/Question';

const Questions: NextPage = () => {
  return (
    <Container>
      <Question></Question>
    </Container>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 62px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

export default Questions;
