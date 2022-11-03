import type { NextPage } from 'next';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { useContract, useContractRead, useSigner } from 'wagmi';
import { useForm, SubmitHandler } from 'react-hook-form';
import OptimisticOracle from '../../../contracts/out/OptimisticOracle.sol/OptimisticOracle.json';
import { addresses } from '../../../contracts/addresses';
import Table from '../../components/QuestionsTable';
import { QuestionType } from '../../types';
import { useState } from 'react';
import Question from '../../components/Question';
import { useRouter } from 'next/router';

const Questions: NextPage = () => {
  const { query } = useRouter();
  // console.log(query.id);

  return (
    <Container>
      <Question></Question>
      {/* <TableContainer>
        <h2>More Questions</h2>
        <Table />
      </TableContainer> */}
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

const Container = styled.div`
  min-height: calc(100vh - 62px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

export default Questions;
