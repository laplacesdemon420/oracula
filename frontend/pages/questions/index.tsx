import type { NextPage } from 'next';
import styled from 'styled-components';
import Table from '../../components/QuestionsTable';
import AskQuestion from '../../components/AskQuestion';

const Questions: NextPage = () => {
  return (
    <Container>
      <AskQuestion></AskQuestion>
      <TableContainer>
        <h2>Questions</h2>
        <Table />
      </TableContainer>
    </Container>
  );
};

const TableContainer = styled.div`
  width: 90%;
  /* border: 1px solid ${({ theme }) => theme.background.tertiary}; */
  border-radius: 10px 10px 0 0;
  margin-top: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const OutcomeDiv = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid ${({ theme }) => theme.text.primary};
  border-radius: 10px;
  padding: 0.5rem;

  .upper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: ${({ theme }) => theme.typeScale.header6};
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${({ theme }) => theme.text.primary};
    font-weight: 500;
    svg {
      color: ${({ theme }) => theme.colors.green};
    }
  }
  .lower {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: ${({ theme }) => theme.typeScale.header6};
    font-weight: 500;
    padding-top: 0.5rem;
    svg {
      color: ${({ theme }) => theme.colors.red};
    }
  }
`;

const StyledQuestion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  label {
    font-size: ${({ theme }) => theme.typeScale.smallParagraph};
    font-weight: 800;
  }

  .resolution-source {
    padding: 9px;
    border-radius: 10px;
    border: 2px solid ${({ theme }) => theme.text.primary};
  }

  .resolution-date {
    padding: 8px;
    border-radius: 10px;
    border: 2px solid ${({ theme }) => theme.text.primary};
  }
`;

const Resolution = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
`;

const Container = styled.div`
  min-height: calc(100vh - 62px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const Ask = styled.div`
  width: 600px;
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-weight: 800;
    font-size: 2.25rem;
  }

  p {
    font-weight: 800;
    font-size: 1.5rem;
  }

  @media screen and (max-width: 700px) {
    width: 80%;
  }
`;

const StyledForm = styled.form`
  width: 100%;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .question {
    padding: 0.75rem;
    border-radius: 10px;
    border: 2px solid ${({ theme }) => theme.text.primary};
    font-size: ${({ theme }) => theme.typeScale.paragraph};
  }

  .outcomes {
    font-size: ${({ theme }) => theme.typeScale.smallParagraph};
  }
  @media screen and (max-width: 700px) {
    /* width: 80%; */
  }
`;

const Button = styled.button`
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

export default Questions;
