import styled from 'styled-components';
import OptimisticOracle from '../../contracts/out/OptimisticOracle.sol/OptimisticOracle.json';
import Token from '../../contracts/out/Token.sol/OPTI.json';
import { addresses } from '../utils';
import {
  useAccount,
  useContract,
  useContractRead,
  useNetwork,
  useSigner,
} from 'wagmi';
import { ethers } from 'ethers';
import { useState } from 'react';

export default function Proposed({
  question,
  proposal,
}: {
  question: any;
  proposal: any;
}) {
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [proposalLoading, setProposalLoading] = useState(false);
  const [finalizationLoading, setFinalizationLoading] = useState(false);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const activeChain = chain?.network;
  const { data: signer } = useSigner();
  const tokenContract = useContract({
    address: addresses[activeChain ? activeChain : 'bittorrent'].token,
    abi: Token.abi,
    signerOrProvider: signer,
  });

  const oracleContract = useContract({
    address: addresses[activeChain ? activeChain : 'bittorrent'].oo,
    abi: OptimisticOracle.abi,
    signerOrProvider: signer,
  });

  const { data: balance } = useContractRead({
    address: addresses[activeChain ? activeChain : 'bittorrent'].token,
    abi: Token.abi,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
    select: (data: any) => ethers.utils.formatEther(data),
  });

  const { data: isApproved } = useContractRead({
    address: addresses[activeChain ? activeChain : 'bittorrent'].token,
    abi: Token.abi,
    functionName: 'allowance',
    args: [address, addresses[activeChain ? activeChain : 'bittorrent'].oo],
    enabled: !!address,
    watch: true,
    select: (data: any) => ethers.utils.parseEther('10').lte(data),
  });

  const approve = async () => {
    if (!tokenContract) return;

    setApprovalLoading(true);
    try {
      let approval = await tokenContract.approve(
        addresses[activeChain ? activeChain : 'bittorrent'].oo,
        ethers.utils.parseEther('100')
      );
      await approval.wait();
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
    } catch (e) {
      console.log(e);
    }
    setFinalizationLoading(false);
  };

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
        To dispute, <strong>you post a bond of 10 Oracula</strong>. This is done
        to incentivize good disputes. If your dispute is proven to be correct in
        the vote, you&apos;ll get the 10 Oracula back. If your dispute is proven
        to be wrong, you&apos;ll lose it. Therefore, you need to hold oracula
        tokens to be able to vote.
      </p>
      <p>
        <strong>Oracula balance:</strong> <span>{balance as string}</span>
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
}

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
