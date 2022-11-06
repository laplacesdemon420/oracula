import styled from 'styled-components';
import { BsCheckCircleFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import OptimisticOracle from '../../contracts/out/OptimisticOracle.sol/OptimisticOracle.json';
import Token from '../../contracts/out/Token.sol/OPTI.json';
import { addresses } from '../../contracts/addresses';
import {
  useAccount,
  useContract,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from 'wagmi';
import { SubmitHandler, useForm } from 'react-hook-form';
import { timestampToDate } from '../utils';
import { ethers } from 'ethers';
import { useState } from 'react';

// gets the actual question

export default function QuestionInfo({
  question,
  refetchQuestion,
  proposal,
  vote,
}: {
  question: any;
  refetchQuestion: any;
  proposal: any;
  vote: any;
}) {
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [proposalLoading, setProposalLoading] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);
  const [finalizationLoading, setFinalizationLoading] = useState(false);
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const tokenContract = useContract({
    address: addresses.goerli.token,
    abi: Token.abi,
    signerOrProvider: signer,
  });

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

  const proposeForm = useForm<{
    answer: 'yes' | 'no';
  }>();

  const proposeAnswer: SubmitHandler<{ answer: 'yes' | 'no' }> = async (
    data
  ) => {
    if (!oracleContract) return;

    if (!data.answer) {
      console.log('Choose yes or no.');
      return;
    }

    const result = data.answer === 'yes' ? 1 : 2;

    setProposalLoading(true);
    try {
      let proposal = await oracleContract.proposeAnswer(
        question.questionId,
        result
      );
      await proposal.wait();
      console.log(proposal.hash);
    } catch (e) {
      console.log(e);
    }
    // await refetchQuestion();
    setProposalLoading(false);
  };

  const { data: disputer } = useContractRead({
    address: addresses.goerli.oo,
    abi: OptimisticOracle.abi,
    functionName: 'disputerByQuestionId',
    args: [question?.questionId || ''],
    enabled: !!question && !!question.questionId,
    // select: (data: any) => ethers.utils.formatEther(data),
  });

  const { data: balance } = useContractRead({
    address: addresses.goerli.token,
    abi: Token.abi,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
    select: (data: any) => ethers.utils.formatEther(data),
  });

  const { data: isApproved } = useContractRead({
    address: addresses.goerli.token,
    abi: Token.abi,
    functionName: 'allowance',
    args: [address, addresses.goerli.oo],
    enabled: !!address,
    watch: true,
    select: (data: any) => ethers.utils.parseEther('10').lte(data),
  });

  const phase: number = 0;

  const now = ethers.BigNumber.from(Math.floor(new Date().getTime() / 1000));
  let readyToPropose = false;
  if (question && question.expiry) {
    readyToPropose = now.gt(question?.expiry);
  }

  const approve = async () => {
    if (!tokenContract) return;

    setApprovalLoading(true);
    try {
      let approval = await tokenContract.approve(
        addresses.goerli.oo,
        ethers.utils.parseEther('100')
      );
      await approval.wait();
      console.log(approval.hash);
    } catch (e) {
      console.log(e);
    }
    setApprovalLoading(false);
  };

  const finalize = async () => {
    if (!oracleContract) return;

    setFinalizationLoading(true);
    try {
      let finalization = await oracleContract.finalizeProposal(
        question.questionId
      );
      await finalization.wait();
      console.log(finalization.hash);
    } catch (e) {
      console.log(e);
    }
    setFinalizationLoading(false);
  };

  const dispute = async () => {
    if (!oracleContract) return;

    setFinalizationLoading(true);
    try {
      let dispute = await oracleContract.disputeProposal(question.questionId);
      await dispute.wait();
      console.log(dispute.hash);
    } catch (e) {
      console.log(e);
    }
    setFinalizationLoading(false);
  };

  console.log(disputer);

  if (question?.stage === 0) {
    return (
      <div className="info">
        <p className="headers">
          Resolution Date:{' '}
          {timestampToDate(question?.expiry.toString(), 'seconds')}
        </p>
        <p className="headers">
          Resolution Source: {question?.resolutionSource}
        </p>
        <p className="headers">Propose answer:</p>
        <p>
          To propose, <strong>you post a bond of 10 Opti</strong>. This is done
          to incentivize good proposals. If your proposals gets disputed and
          overturned in the vote, then you will lose the 10 Opti. If your
          proposal goes through, you will get back your 10 Opti. Therefore, you
          need to hold opti tokens to be able to vote.
        </p>
        <p>
          <strong>Opti balance:</strong> <span>{balance as string}</span>
        </p>
        {isApproved === false && (
          <ApproveDiv>
            {approvalLoading ? (
              <button className="approve-button" onClick={approve}>
                Loading...
              </button>
            ) : (
              <button className="approve-button" onClick={approve}>
                Approve
              </button>
            )}
          </ApproveDiv>
        )}
        <ProposeForm
          onSubmit={proposeForm.handleSubmit(proposeAnswer)}
          isReady={readyToPropose && isApproved === true}
        >
          <p className="propose-header">{question?.questionString}</p>

          <div>
            <label htmlFor="yes">
              <input
                {...proposeForm.register('answer')}
                type="radio"
                value="yes"
                id="field-yes"
              />
              <span>Yes</span>
            </label>
            <label htmlFor="no">
              <input
                {...proposeForm.register('answer')}
                type="radio"
                value="no"
                id="field-no"
              />
              <span>No</span>
            </label>
            <button
              type="submit"
              className="propose-button"
              disabled={!readyToPropose || isApproved === false}
            >
              {proposalLoading ? 'proposing...' : 'propose'}
            </button>
          </div>
        </ProposeForm>
      </div>
    );
  } else if (question?.stage === 1) {
    // const timeToFinality =
    console.log('1:', proposal?.timestamp.toString());
    console.log('2:', Math.floor(new Date().getTime() / 1000));

    let ttf = Math.max(
      parseInt(proposal?.timestamp.toString()) +
        600 -
        Math.floor(new Date().getTime() / 1000),
      0
    );

    return (
      <div className="info">
        <p className="headers">
          Proposed Answer:{' '}
          {proposal?.answer === 0
            ? 'INVALID'
            : proposal?.answer === 1
            ? 'YES'
            : 'NO'}{' '}
          by {proposal?.proposer}
        </p>
        <p className="headers">Time to Finality: {ttf}s</p>
        <p className="headers">Dispute proposal:</p>
        <p>
          To dispute, <strong>you post a bond of 10 Opti</strong>. This is done
          to incentivize good disputes. If your dispute is proven to be correct
          in the vote, you&apos;ll get the 10 Opti back. If your dispute is
          proven to be wrong, you&apos;ll lose it. Therefore, you need to hold
          opti tokens to be able to vote.
        </p>
        <p>
          <strong>Opti balance:</strong> <span>{balance as string}</span>
        </p>
        {isApproved === false && (
          <ApproveDiv>
            {approvalLoading ? (
              <button className="approve-button" onClick={approve}>
                Loading...
              </button>
            ) : (
              <button className="approve-button" onClick={approve}>
                Approve
              </button>
            )}
          </ApproveDiv>
        )}
        {finalizationLoading ? (
          <Button>Loading...</Button>
        ) : ttf > 0 ? (
          <Button onClick={dispute}>DISPUTE</Button>
        ) : (
          <Button onClick={finalize}>FINALIZE</Button>
        )}
      </div>
    );
  } else if (question?.stage === 2) {
    return (
      <div className="info">
        <p className="headers">Proposal: Yes</p>
        <p className="headers">The proposal is disputed!</p>
        <p>
          If a proposal gets disputed, that means{' '}
          <strong>we are entering a vote</strong>. In the first part of vote,
          <strong> you commit your choice together with a password</strong>. In
          the second part of the vote , <strong>you reveal your vote</strong>.
        </p>
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
        <p>
          Choose your answer together with a password. The password will
          essentially <strong>encrypt your vote</strong> so that no one else can
          see what you voted on. In the reveal phase, you use your password to{' '}
          <strong>decrypt your vote</strong>. Because of this,{' '}
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
      </div>
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
      <p>Resolution Date: 2023-01-01 (100d 44m 33s)</p>
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

const ApproveDiv = styled.div`
  display: flex;
  .approve-button {
    background-color: black;
    color: white;
    font-weight: 600;
    font-size: 1.15rem;
    padding: 10px 16px;
    border-radius: 7px;
    /* width: 25%; */
    :hover {
      cursor: pointer;
      transition: all 0.25s ease;
      transform: scale(1.025) perspective(1px);
    }
  }
`;
