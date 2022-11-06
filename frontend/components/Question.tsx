import styled from 'styled-components';
import { BsCheckCircleFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import OptimisticOracle from '../../contracts/out/OptimisticOracle.sol/OptimisticOracle.json';
import Token from '../../contracts/out/Token.sol/OPTI.json';
import { addresses } from '../../contracts/addresses';
import { useContractRead } from 'wagmi';
import { SubmitHandler, useForm } from 'react-hook-form';
import { timestampToDate } from '../utils';
import { ethers } from 'ethers';
import QuestionInfo from './QuestionInfo';

export default function Question() {
  const { query } = useRouter();

  console.log('qid:', query.id);

  // get actual question here
  const {
    data: question,
    refetch: refetchQuestion,
  }: { data: any; refetch: any } = useContractRead({
    address: addresses.goerli.oo,
    abi: OptimisticOracle.abi,
    functionName: 'getQuestionById',
    args: ['0x' + query.id],
    enabled: !!query.id,
    watch: true,
  });

  const { data: proposal } = useContractRead({
    address: addresses.goerli.oo,
    abi: OptimisticOracle.abi,
    functionName: 'getProposalByQuestionId',
    args: ['0x' + query.id],
    enabled: !!query.id,
    watch: true,
  });

  const { data: vote } = useContractRead({
    address: addresses.goerli.oo,
    abi: OptimisticOracle.abi,
    functionName: 'voteByQuestionId',
    args: ['0x' + query.id],
    enabled: !!query.id,
    watch: true,
  });

  console.log(question);
  // console.log(proposal);
  console.log(vote);

  // const stage: number = 2;

  return (
    <Container>
      <p className="question">{question?.questionString}</p>
      <Timeline>
        <Stage isActive={question?.stage === 0}>
          {/* if now > expiry, should be possible to make a proposal */}
          <p>ASKED</p>
          <BsCheckCircleFill />
        </Stage>
        <Stage isActive={question?.stage === 1}>
          <p>PROPOSED</p>
          {[1, 2, 3].includes(question?.stage) ? <BsCheckCircleFill /> : null}
        </Stage>
        <Stage isActive={question?.stage === 2}>
          <p>DISPUTED</p>
          {[2, 3].includes(question?.stage) ? <BsCheckCircleFill /> : null}
        </Stage>
        <Stage isActive={question?.stage === 3}>
          <p>FINALIZED</p>
          {question?.stage === 3 ? <BsCheckCircleFill /> : null}
        </Stage>
      </Timeline>
      <QuestionInfo
        question={question}
        refetchQuestion={refetchQuestion}
        proposal={proposal}
        vote={vote}
      />
    </Container>
  );
}

const Stage = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  /* border-right: 3px solid ${({ theme }) => theme.text.primary}; */
  padding: 1rem;

  p {
    font-weight: 800;
    color: ${({ isActive, theme }) =>
      isActive ? theme.text.primary : theme.background.senary};
    font-size: 1.25rem;
  }

  svg {
    height: 22px;
    width: 22px;
    color: ${({ theme }) => theme.colors.green};
  }
`;

const Timeline = styled.div`
  width: 100%;
  border-radius: 10px;
  border: 3px solid ${({ theme }) => theme.text.primary};
  display: grid;
  grid-template-columns: repeat(4, 1fr); ;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;

  width: 700px;
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  /* align-items: center; */

  .question {
    font-weight: 800;
    font-size: 1.5rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    .headers {
      font-weight: 800;
      font-size: 1.5rem;
    }
    .propose-header {
      font-weight: 800;
      font-size: 1.25rem;
    }
  }

  @media screen and (max-width: 700px) {
    width: 80%;
  }
`;
