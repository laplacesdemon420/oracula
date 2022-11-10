import styled from 'styled-components';
import Asked from './Asked';
import Proposed from './Proposed';
import Disputed from './Disputed';

export default function QuestionInfo({
  question,
  proposal,
  vote,
}: {
  question: any;
  proposal: any;
  vote: any;
}) {
  if (question?.stage === 0) {
    return <Asked question={question}></Asked>;
  } else if (question?.stage === 1) {
    return <Proposed question={question} proposal={proposal}></Proposed>;
  } else if (question?.stage === 2) {
    return (
      <Disputed question={question} proposal={proposal} vote={vote}></Disputed>
    );
  } else if (question?.stage === 3) {
    return (
      <div className="info">
        <Finalized>
          <p className="header">Finalized answer:</p>
          <p className="answer">
            {question?.result === 0
              ? 'INVALID'
              : question?.result === 1
              ? 'YES'
              : 'NO'}{' '}
          </p>
        </Finalized>
      </div>
    );
  }

  return (
    <div className="info">
      <p>Loading...</p>
    </div>
  );
}

const Finalized = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  .header {
    font-weight: 800;
    font-size: 2rem;
  }
  .answer {
    font-weight: 800;
    font-size: 2.5rem;
  }
`;
