import type { NextPage } from 'next';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { useContract, useSigner } from 'wagmi';
import { useForm, SubmitHandler } from 'react-hook-form';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import OptimisticOracle from '../../../contracts/out/OptimisticOracle.sol/OptimisticOracle.json';
import { addresses } from '../../../contracts/addresses';
import DisputesTable from '../../components/DisputesTable';
import { DisputeType } from '../../types';
import { useState } from 'react';

const Disputes: NextPage = () => {
  return (
    <Container>
      <TableContainer>
        <h2>Disputes</h2>
        <DisputesTable />
      </TableContainer>
    </Container>
  );
};

const TableContainer = styled.div`
  width: 90%;
  /* border: 1px solid ${({ theme }) => theme.background.tertiary}; */
  border-radius: 10px 10px 0 0;
  margin-top: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Container = styled.div`
  min-height: calc(100vh - 62px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const Button = styled.button`
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

export default Disputes;
