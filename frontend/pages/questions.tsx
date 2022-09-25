import type { NextPage } from 'next';
import styled from 'styled-components';

/*
CREATE A REACT HOOK FORM with:
- question
- resolution source
- resolution date
*/

const Questions: NextPage = () => {
  return (
    <Container>
      <Ask>
        <h1>ASK ANY QUESTION!</h1>
      </Ask>
    </Container>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 62px);
  display: flex;
  justify-content: center;
`;

const Ask = styled.div`
  margin-top: 3rem;

  h1 {
    font-weight: 800;
    font-size: 2.25rem;
  }
`;

export default Questions;
