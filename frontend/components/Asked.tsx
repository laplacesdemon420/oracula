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

export default function Asked({ question }: { question: any }) {
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [proposalLoading, setProposalLoading] = useState(false);
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

  const { data: balance, isLoading }: { data: any; isLoading: boolean } =
    useContractRead({
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

  return (
    <div className="info">
      <p className="headers">
        Resolution Date:{' '}
        {timestampToDate(question?.expiry.toString(), 'seconds')}
      </p>
      <p className="headers">Resolution Source: {question?.resolutionSource}</p>
      <p className="headers">Propose answer:</p>
      <p>
        To propose, <strong>you post a bond of 10 Opti</strong>. This is done to
        incentivize good proposals. If your proposals gets disputed and
        overturned in the vote, then you will lose the 10 Opti. If your proposal
        goes through, you will get back your 10 Opti. Therefore, you need to
        hold opti tokens to be able to vote.
      </p>
      <p>
        <strong>Opti balance:</strong> <span>{!isLoading && balance}</span>
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
