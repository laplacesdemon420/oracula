import type { NextPage, InferGetStaticPropsType, GetStaticProps } from 'next';
import styled from 'styled-components';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { addresses } from '../utils';
import OptimisticOracle from '../../contracts/out/OptimisticOracle.sol/OptimisticOracle.json';
import Token from '../../contracts/out/Token.sol/OPTI.json';
import Table from '../components/QuestionsTable';
import { timestampToDate } from '../utils';
import { useAccount, useContract, useContractRead, useNetwork } from 'wagmi';
import { useEffect, useState } from 'react';

type Stats = {
  qCount: number;
  pCount: number;
  dCount: number;
  fCount: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>();
  const [activeBalance, setActiveBalance] = useState(0);
  const { chain } = useNetwork();
  const activeChain = chain?.network;

  const { address } = useAccount();

  console.log('ac:', activeChain);

  const { data: balance } = useContractRead({
    address: addresses[activeChain ? activeChain : 'aurora'].token,
    abi: Token.abi,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
    select: (data: any) => ethers.utils.formatEther(data),
  });

  // get all questions
  const { data }: { data: Stats | any } = useContractRead({
    address: addresses[activeChain ? activeChain : 'aurora'].oo,
    abi: OptimisticOracle.abi,
    functionName: 'getAllQuestions',
    select: (data: any) => {
      let [qCount, pCount, dCount, fCount] = [data.length, 0, 0, 0];
      for (const q of data) {
        if (q.stage === 1) {
          pCount++;
        } else if (q.stage === 2) {
          dCount++;
        } else if (q.stage === 3) {
          fCount++;
        }
      }
      return {
        qCount,
        pCount,
        dCount,
        fCount,
      };
    },
    watch: true,
  });

  useEffect(() => {
    setStats(data as Stats);
  }, [data]);

  useEffect(() => {
    setActiveBalance(balance as number);
  }, [balance]);

  console.log(balance);

  return (
    <Container>
      <Inner>
        <AccountInfo>
          <div>
            <ConnectButton
              chainStatus="none"
              accountStatus="address"
              showBalance={true}
            />
          </div>
          <div>
            <p>
              <strong>Opti balance:</strong> <span>{activeBalance}</span>
            </p>
          </div>
        </AccountInfo>
        <AppInfo>
          <div>
            <p className="header">{stats?.qCount}</p>
            <p className="description">Open Questions</p>
          </div>
          <div>
            <p className="header">{stats?.pCount}</p>
            <p className="description">Proposals</p>
          </div>
          <div>
            <p className="header">{stats?.dCount}</p>
            <p className="description">Disputes</p>
          </div>
          <div>
            <p className="header">{stats?.fCount}</p>
            <p className="description">Finalized</p>
          </div>
        </AppInfo>
        <TableContainer>
          <h2>Questions</h2>
          <Table />
        </TableContainer>
      </Inner>
    </Container>
  );
}

const TableContainer = styled.div`
  width: 100%;
  /* border: 1px solid ${({ theme }) => theme.background.tertiary}; */
  border-radius: 10px 10px 0 0;
  margin-top: 1rem;
  /* padding: 1.5rem; */
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AccountInfo = styled.div`
  display: grid;
  grid-template-columns: 265px 1fr; // 258px
  gap: 1rem;
  div {
    padding: 1rem;
    border: 1px solid ${({ theme }) => theme.background.tertiary};
    display: flex;
    align-items: center;
    p {
      font-weight: 600;
      font-size: ${({ theme }) => theme.typeScale.header6};
    }
  }
`;

const AppInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 1rem;
    height: 150px;
    border: 1px solid ${({ theme }) => theme.background.tertiary};

    .header {
      font-weight: 800;
      font-size: ${({ theme }) => theme.typeScale.header1};
    }
    .description {
      font-weight: 600;
      font-size: ${({ theme }) => theme.typeScale.header6};
    }
  }
`;

const Inner = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Container = styled.div`
  color: ${({ theme }) => theme.text.primary};

  min-height: calc(100vh - 62px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-top: 3rem;
`;
