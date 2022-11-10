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
  border-radius: 10px 10px 0 0;
  margin-top: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Container = styled.div`
  color: ${({ theme }) => theme.text.primary};
  min-height: calc(100vh - 62px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

export default Questions;
