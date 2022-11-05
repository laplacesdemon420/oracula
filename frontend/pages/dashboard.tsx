import type { NextPage, InferGetStaticPropsType, GetStaticProps } from 'next';
import styled from 'styled-components';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { addresses } from '../../contracts/addresses';
import OptimisticOracle from '../../contracts/out/OptimisticOracle.sol/OptimisticOracle.json';
import Table from '../components/QuestionsTable';

export default function Dashboard() {
  // get all questions

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
            <p>Balance: 105.3 $OPTI, Active Balance: 10 $OPTI</p>
          </div>
        </AccountInfo>
        <AppInfo>
          <div>
            <p className="header">41</p>
            <p className="description">Open Questions</p>
          </div>
          <div>
            <p className="header">22</p>
            <p className="description">Proposals</p>
          </div>
          <div>
            <p className="header">5</p>
            <p className="description">Disputes</p>
          </div>
          <div>
            <p className="header">67</p>
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
  grid-template-columns: 258px 1fr;
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
  min-height: calc(100vh - 62px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-top: 3rem;
`;
