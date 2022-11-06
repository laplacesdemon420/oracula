import styled from 'styled-components';
import { BsCheckCircleFill } from 'react-icons/bs';
import { BsArrowRightCircleFill } from 'react-icons/bs';
import OptimisticOracle from '../../contracts/out/OptimisticOracle.sol/OptimisticOracle.json';
import Token from '../../contracts/out/Token.sol/OPTI.json';
import { addresses } from '../../contracts/addresses';
import { useAccount, useContract, useContractRead, useSigner } from 'wagmi';
import { SubmitHandler, useForm } from 'react-hook-form';
import { timestampToDate } from '../utils';
import { ethers } from 'ethers';
import { useState } from 'react';

const ZERO_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

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
  const [revealLoading, setRevealLoading] = useState(false);
  const [finalizationLoading, setFinalizationLoading] = useState(false);
  const { address } = useAccount();
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

  const commitAnswer: SubmitHandler<{
    answer: 'yes' | 'no';
    password: string;
  }> = async (data) => {
    if (!oracleContract) return;

    if (!data.answer) {
      console.log('Choose yes or no.');
      return;
    }

    console.log(data);

    const result = data.answer === 'yes' ? 1 : 2;
    const hash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['uint256', 'string'],
        [result, data.password]
      )
    );
    console.log(hash);

    setCommitLoading(true);
    try {
      let commit = await oracleContract.commitVote(question.questionId, hash);
      await commit.wait();
      console.log(commit.hash);
    } catch (e) {
      console.log(e);
    }

    setCommitLoading(false);
  };

  const revealForm = useForm<{
    answer: 'yes' | 'no';
    password: string;
  }>();

  const revealAnswer: SubmitHandler<{
    answer: 'yes' | 'no';
    password: string;
  }> = async (data) => {
    if (!oracleContract) return;

    if (!data.answer) {
      console.log('Choose yes or no.');
      return;
    }

    console.log(data);

    const result = data.answer === 'yes' ? 1 : 2;

    setRevealLoading(true);
    try {
      let reveal = await oracleContract.revealVote(
        question.questionId,
        result,
        data.password
      );
      await reveal.wait();
      console.log(reveal.hash);
    } catch (e) {
      console.log(e);
    }

    setRevealLoading(false);
  };

  const { data: commitHash } = useContractRead({
    address: addresses.goerli.oo,
    abi: OptimisticOracle.abi,
    functionName: 'commit',
    args: [question.questionId, address],
    enabled: !!question.questionId && !!address,
    watch: true,
  });

  const finalizeVote = async () => {
    if (!oracleContract) return;

    setFinalizationLoading(true);
    try {
      let finalization = await oracleContract.finalizeVote(question.questionId);
      await finalization.wait();
      console.log(finalization.hash);
    } catch (e) {
      console.log(e);
    }
    setFinalizationLoading(false);
  };

  const getOutcome = (vote: any) => {
    if (!vote) return '';

    if (vote.yesCount.gt(vote.noCount)) {
      return 'YES';
    } else if (vote.yesCount.lt(vote.noCount)) {
      return 'NO';
    }

    return 'INVALID';
  };

  const now = ethers.BigNumber.from(Math.floor(new Date().getTime() / 1000));
  const commitEnd = vote?.commitEndTimestamp;
  const revealEnd = vote?.revealEndTimestamp;

  console.log();

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
      {phase === 'commit' ? (
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
          {commitHash === ZERO_HASH ? (
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
                <button
                  type="submit"
                  className="propose-button"
                  disabled={false}
                >
                  {commitLoading ? 'committing...' : 'commit'}
                </button>
              </div>
            </ProposeForm>
          ) : (
            <p className="headers">
              Your vote is committed! Now just wait for the reveal phase.
            </p>
          )}
        </>
      ) : phase === 'reveal' ? (
        <>
          <p>
            Now it&apos;s time to <strong>decrypt and reveal your vote</strong>{' '}
            so that the smart contract can see what you voted on. Choose the
            same Yes or No value as you did in the commit phase, and{' '}
            <strong>the exact same password</strong>. Then click reveal.
          </p>
          <p className="headers">
            Reveal phase ends in: {finalizeIn.toString()}
          </p>
          <VotesDiv>
            <p className="headers">Yes votes: {vote?.yesCount.toString()}</p>
            <p className="headers">No votes: {vote?.noCount.toString()}</p>
          </VotesDiv>

          <ProposeForm
            onSubmit={revealForm.handleSubmit(revealAnswer)}
            isReady={true}
          >
            <p className="propose-header">{question?.questionString}</p>

            <div>
              <label htmlFor="yes">
                <input
                  {...revealForm.register('answer')}
                  type="radio"
                  value="yes"
                  id="field-yes"
                />
                <span>Yes</span>
              </label>
              <label htmlFor="no">
                <input
                  {...revealForm.register('answer')}
                  type="radio"
                  value="no"
                  id="field-no"
                />
                <span>No</span>
              </label>
              <input
                className="password"
                placeholder="password"
                {...revealForm.register('password', { required: true })}
              />
              <button type="submit" className="propose-button" disabled={false}>
                {revealLoading ? 'revealing...' : 'reveal'}
              </button>
            </div>
          </ProposeForm>
        </>
      ) : (
        <>
          <p>
            Now it&apos;s time to <strong>finalize the vote</strong> so that the
            smart contract can see what you voted on. Choose the same Yes or No
            value as you did in the commit phase, and{' '}
            <strong>the exact same password</strong>. Then click reveal.
          </p>
          <VotesDiv>
            <p className="headers">Yes votes: {vote?.yesCount.toString()}</p>
            <p className="headers">No votes: {vote?.noCount.toString()}</p>
            <BsArrowRightCircleFill />
            <p className="headers"> {getOutcome(vote)}</p>
          </VotesDiv>
          {finalizationLoading ? (
            <Button>Finalizing...</Button>
          ) : (
            <Button onClick={finalizeVote}>Finalize</Button>
          )}
        </>
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

const VotesDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  svg {
    height: 25px;
    width: 25px;
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
