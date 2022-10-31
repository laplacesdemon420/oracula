import styled from 'styled-components';
import { BsCheckCircleFill } from 'react-icons/bs';
import { useRouter } from 'next/router';

// gets the actual question

const InformationBox = ({ stage }: { stage: string }) => {
  console.log(stage);

  if (stage === 'asked') {
    return (
      <div className="info">
        <p>Resolution Date: 2023-01-01 (100d 44m 33s)</p>
        <p>Resolution Source: https://coingecko.com</p>
      </div>
    );
  } else if (stage === 'proposed') {
    return (
      <div className="info">
        <p>Proposed Answer: Yes</p>
        <p>Time to Finality: 23h 44m 13s</p>
        <Button>DISPUTE</Button>
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

  const stage: string = 'proposed';

  return (
    <Container>
      <p className="question">
        Will the price of $ETH be over $1500 on 2023-01-01?
      </p>
      <Timeline>
        <Stage isActive={stage === 'asked'}>
          {/* if now > expiry, should be possible to make a proposal */}
          <p>ASKED</p>
          <BsCheckCircleFill />
        </Stage>
        <Stage isActive={stage === 'proposed'}>
          <p>PROPOSED</p>
          {['proposed', 'disputed', 'finalized'].includes(stage) ? (
            <BsCheckCircleFill />
          ) : null}
        </Stage>
        <Stage isActive={stage === 'disputed'}>
          <p>DISPUTED</p>
          {['disputed', 'finalized'].includes(stage) ? (
            <BsCheckCircleFill />
          ) : null}
        </Stage>
        <Stage isActive={stage === 'finalized'}>
          <p>FINALIZED</p>
          {stage === 'finalized' ? <BsCheckCircleFill /> : null}
        </Stage>
      </Timeline>
      <InformationBox stage={stage} />
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
    p {
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
