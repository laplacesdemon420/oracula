import styled from 'styled-components';
import { BsCheckCircleFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import OptimisticOracle from '../../contracts/out/OptimisticOracle.sol/OptimisticOracle.json';
import { addresses } from '../../contracts/addresses';
import { useContractRead } from 'wagmi';
import { SubmitHandler, useForm } from 'react-hook-form';

// gets the actual question

const ProposeForm = styled.form<{ isReady: boolean }>`
  opacity: ${({ isReady }) => (isReady ? '1' : '0.25')};
  cursor: ${({ isReady }) => (isReady ? 'default' : 'not-allowed')};
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  div {
    display: flex;
    gap: 1rem;
    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      input {
        height: 27px;
        width: 27px;
      }
    }
  }
  button {
    margin-left: 1.25rem;
    background-color: black;
    color: white;
    font-weight: 600;
    font-size: 1.15rem;
    padding: 10px 16px;
    border-radius: 7px;
    :hover {
      cursor: ${({ isReady }) => (isReady ? 'pointer' : 'default')};
      transition: all 0.25s ease;
      transform: scale(1.025) perspective(1px);
    }
  }
`;

const InformationBox = ({
  stage,
  question,
  proposal,
  vote,
}: {
  stage: number;
  question: any;
  proposal: any;
  vote: any;
}) => {
  console.log(stage);
  const { register, handleSubmit } = useForm<{
    answer: 'yes' | 'no';
  }>();
  const proposeAnswer: SubmitHandler<{ answer: 'yes' | 'no' }> = async (
    data
  ) => {
    console.log(data);
    // propose
    // refetch question
    // refetch proposal
  };

  const isReady = true;
  const phase: number = 0;

  if (stage === 0) {
    return (
      <div className="info">
        <p className="headers">
          Resolution Date: {question?.expiry.toString()} (100d 44m 33s)
        </p>
        <p className="headers">
          Resolution Source: {question?.resolutionSource}
        </p>
        <ProposeForm onSubmit={handleSubmit(proposeAnswer)} isReady={isReady}>
          <p className="headers">Propose answer:</p>
          <div>
            <label htmlFor="yes">
              <input
                {...register('answer')}
                type="radio"
                value="yes"
                id="field-yes"
                checked
              />
              <span>Yes</span>
            </label>
            <label htmlFor="no">
              <input
                {...register('answer')}
                type="radio"
                value="no"
                id="field-no"
              />
              <span>No</span>
            </label>
            <button type="submit">propose</button>
          </div>
        </ProposeForm>
      </div>
    );
  } else if (stage === 1) {
    return (
      <div className="info">
        <p className="headers">Proposed Answer: Yes</p>
        <p className="headers">Time to Finality: 23h 44m 13s</p>
        <Button>DISPUTE</Button>
      </div>
    );
  } else if (stage === 2) {
    return (
      <div className="info">
        <p className="headers">Proposal: Yes by 0xdeadbeef...1337</p>
        <p className="headers">Disputed by 0xbadc0ffee...1338</p>
        <Timeline2>
          <Phase isActive={phase === 0}>
            {/* if now > expiry, should be possible to make a proposal */}
            <p className="phase">COMMIT</p>
            <BsCheckCircleFill />
          </Phase>
          <Phase isActive={phase === 1}>
            <p className="phase">REVEAL</p>
            {phase === 1 ? <BsCheckCircleFill /> : null}
          </Phase>
        </Timeline2>
      </div>
    );
  }

  return (
    <div className="info">
      <p>Resolution Date: 2023-01-01 (100d 44m 33s)</p>
    </div>
  );
};

export default function Question() {
  const { query } = useRouter();

  console.log('qid:', query.id);

  // get actual question here
  const { data: question }: { data: any } = useContractRead({
    address: addresses.goerli.oo,
    abi: OptimisticOracle.abi,
    functionName: 'getQuestionById',
    args: ['0x' + query.id],
    enabled: !!query.id,
  });

  const { data: proposal } = useContractRead({
    address: addresses.goerli.oo,
    abi: OptimisticOracle.abi,
    functionName: 'getProposalByQuestionId',
    args: ['0x' + query.id],
    enabled: !!query.id,
  });

  const { data: vote } = useContractRead({
    address: addresses.goerli.oo,
    abi: OptimisticOracle.abi,
    functionName: 'voteByQuestionId',
    args: ['0x' + query.id],
    enabled: !!query.id,
  });

  console.log(question);
  console.log(proposal);
  console.log(vote);

  const stage: number = 2;

  return (
    <Container>
      <p className="question">{question?.questionString}</p>
      <Timeline>
        <Stage isActive={stage === 0}>
          {/* if now > expiry, should be possible to make a proposal */}
          <p>ASKED</p>
          <BsCheckCircleFill />
        </Stage>
        <Stage isActive={stage === 1}>
          <p>PROPOSED</p>
          {[1, 2, 3].includes(stage) ? <BsCheckCircleFill /> : null}
        </Stage>
        <Stage isActive={stage === 2}>
          <p>DISPUTED</p>
          {[2, 3].includes(stage) ? <BsCheckCircleFill /> : null}
        </Stage>
        <Stage isActive={stage === 3}>
          <p>FINALIZED</p>
          {stage === 3 ? <BsCheckCircleFill /> : null}
        </Stage>
      </Timeline>
      <InformationBox
        stage={stage}
        question={question}
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

const Phase = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  /* border-right: 3px solid ${({ theme }) => theme.text.primary}; */
  padding: 0.75rem;

  .phase {
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

const Timeline2 = styled.div`
  margin-top: 1rem;
  /* width: 50%; */
  border-radius: 10px;
  border: 3px solid ${({ theme }) => theme.text.primary};
  display: grid;
  grid-template-columns: repeat(2, 1fr); ;
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
  }

  @media screen and (max-width: 700px) {
    width: 80%;
  }
`;

const Button = styled.button`
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
