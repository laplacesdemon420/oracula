import styled from 'styled-components';
import { BsCheckCircleFill } from 'react-icons/bs';
import OptimisticOracle from '../../contracts/out/OptimisticOracle.sol/OptimisticOracle.json';
import Token from '../../contracts/out/Token.sol/OPTI.json';
import { addresses } from '../../contracts/addresses';
import { useAccount, useContract, useContractRead, useSigner } from 'wagmi';
import { SubmitHandler, useForm } from 'react-hook-form';
import { timestampToDate } from '../utils';
import { ethers } from 'ethers';
import { useState } from 'react';

export default function Disputed({
  question,
  proposal,
  vote,
}: {
  question: any;
  proposal: any;
  vote: any;
}) {
  const [commitLoading, setCommitLoading] = useState(false);
  const { data: signer } = useSigner();

  const oracleContract = useContract({
    address: addresses.goerli.oo,
    abi: OptimisticOracle.abi,
    signerOrProvider: signer,
  });

  const commitForm = useForm<{
    answer: 'yes' | 'no';
    password: string;
  }>();

  const commitAnswer: SubmitHandler<{ answer: 'yes' | 'no' }> = async (
    data
  ) => {
    if (!oracleContract) return;

    if (!data.answer) {
      console.log('Choose yes or no.');
      return;
    }

    console.log(data);

    const result = data.answer === 'yes' ? 1 : 2;

    setCommitLoading(true);
    try {
      let commit = await oracleContract.makeVote(question.questionId, result);
      await commit.wait();
      console.log(commit.hash);
    } catch (e) {
      console.log(e);
    }

    setCommitLoading(false);
  };

  console.log('1:', proposal?.timestamp.toString());
  console.log('2:', Math.floor(new Date().getTime() / 1000));
  const now = ethers.BigNumber.from(Math.floor(new Date().getTime() / 1000));
  const commitEnd = vote?.commitEndTimestamp;
  const revealEnd = vote?.revealEndTimestamp;

  const phase = now.lt(commitEnd)
    ? 'commit'
    : now.lt(revealEnd)
    ? 'reveal'
    : 'finalize';

  const revealIn = commitEnd.sub(now);

  const finalizeIn = revealEnd.sub(now);

  return (
    <div className="info">
      <p className="headers">
        Proposal:{' '}
        {proposal?.answer === 0
          ? 'INVALID'
          : proposal?.answer === 1
          ? 'YES'
          : 'NO'}{' '}
      </p>
      <p className="headers">The proposal is disputed!</p>
      <p>
        If a proposal gets disputed, that means{' '}
        <strong>we are entering a vote</strong>. In the first part of vote,
        <strong> you commit your choice together with a password</strong>. In
        the second part of the vote , <strong>you reveal your vote</strong>.
      </p>
      <Timeline2>
        <Phase isActive={phase === 'commit'}>
          {/* if now > expiry, should be possible to make a proposal */}
          <p className="phase">COMMIT</p>
          {phase !== 'commit' && <BsCheckCircleFill />}
        </Phase>
        <Phase isActive={phase === 'reveal'}>
          <p className="phase">REVEAL</p>
          {phase === 'finalize' && <BsCheckCircleFill />}
        </Phase>
      </Timeline2>
      {phase === 'finalize' ? (
        <>
          <p>
            Choose your answer together with a password. The password will
            essentially <strong>encrypt your vote</strong> so that no one else
            can see what you voted on. In the reveal phase, you use your
            password to <strong>decrypt your vote</strong>. Because of this,{' '}
            <strong>you need to remember your password</strong>.
          </p>
          <p className="headers">
            Reveal phase starts in: {revealIn.toString()}
          </p>
          <p className="headers">Total votes: {vote?.voteCount.toString()}</p>
          <ProposeForm
            onSubmit={commitForm.handleSubmit(commitAnswer)}
            isReady={true}
          >
            <p className="propose-header">{question?.questionString}</p>

            <div>
              <label htmlFor="yes">
                <input
                  {...commitForm.register('answer')}
                  type="radio"
                  value="yes"
                  id="field-yes"
                />
                <span>Yes</span>
              </label>
              <label htmlFor="no">
                <input
                  {...commitForm.register('answer')}
                  type="radio"
                  value="no"
                  id="field-no"
                />
                <span>No</span>
              </label>
              <input
                className="password"
                placeholder="password"
                {...commitForm.register('password', { required: true })}
              />
              <button type="submit" className="propose-button" disabled={false}>
                {commitLoading ? 'committing...' : 'commit'}
              </button>
            </div>
          </ProposeForm>
        </>
      ) : phase === 'reveal' ? (
        <>
          <p>
            Choose your answer together with a password. The password will
            essentially <strong>encrypt your vote</strong> so that no one else
            can see what you voted on. In the reveal phase, you use your
            password to <strong>decrypt your vote</strong>. Because of this,{' '}
            <strong>you need to remember your password</strong>.
          </p>
          <ProposeForm
            onSubmit={commitForm.handleSubmit(commitAnswer)}
            isReady={true}
          >
            <p className="propose-header">{question?.questionString}</p>

            <div>
              <label htmlFor="yes">
                <input
                  {...commitForm.register('answer')}
                  type="radio"
                  value="yes"
                  id="field-yes"
                />
                <span>Yes</span>
              </label>
              <label htmlFor="no">
                <input
                  {...commitForm.register('answer')}
                  type="radio"
                  value="no"
                  id="field-no"
                />
                <span>No</span>
              </label>
              <input
                className="password"
                placeholder="password"
                {...commitForm.register('password', { required: true })}
              />
              <button type="submit" className="propose-button" disabled={false}>
                {commitLoading ? 'committing...' : 'commit'}
              </button>
            </div>
          </ProposeForm>
        </>
      ) : (
        <p>ayo</p>
      )}
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

const Timeline2 = styled.div`
  margin-top: 1rem;
  /* width: 50%; */
  border-radius: 10px;
  border: 3px solid ${({ theme }) => theme.text.primary};
  display: grid;
  grid-template-columns: repeat(2, 1fr); ;
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
  .propose-button {
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
  .password {
    padding: 0.5rem;
    border-radius: 10px;
    border: 2px solid ${({ theme }) => theme.text.primary};
    font-size: ${({ theme }) => theme.typeScale.paragraph};
  }
`;
