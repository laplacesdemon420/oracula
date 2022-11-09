import type { NextPage } from 'next';
import styled from 'styled-components';
import { ethers } from 'ethers';
import { useAccount, useContract, useNetwork, useSigner } from 'wagmi';
import { useForm, SubmitHandler } from 'react-hook-form';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import OptimisticOracle from '../../contracts/out/OptimisticOracle.sol/OptimisticOracle.json';
import Token from '../../contracts/out/Token.sol/OPTI.json';
import { addresses } from '../utils';
import DisputesTable from '../components/DisputesTable';
import { DisputeType } from '../types';
import { useState } from 'react';

const Faucet: NextPage = () => {
  const [choice, setChoice] = useState(10);
  const [mintLoading, setMintLoading] = useState(false);
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const activeChain = chain?.network;
  const tokenContract = useContract({
    address: addresses[activeChain ? activeChain : 'aurora'].token,
    abi: Token.abi,
    signerOrProvider: signer,
  });

  const mint = async () => {
    if (!tokenContract) return;

    setMintLoading(true);
    try {
      let tx = await tokenContract.mint(
        address,
        ethers.utils.parseEther(choice.toString())
      );
      await tx.wait();
      console.log(tx.hash);
    } catch (e) {
      console.log(e);
    }
    setMintLoading(false);
  };

  return (
    <Container>
      <h2>Token Faucet</h2>
      <p>Get some test tokens that you can use for proposing and disputing!</p>
      <Choices>
        <Choice isActive={choice === 5} onClick={() => setChoice(5)}>
          5
        </Choice>
        <Choice isActive={choice === 10} onClick={() => setChoice(10)}>
          10
        </Choice>
        <Choice isActive={choice === 50} onClick={() => setChoice(50)}>
          50
        </Choice>
        <Choice isActive={choice === 100} onClick={() => setChoice(100)}>
          100
        </Choice>
        <Choice isActive={choice === 200} onClick={() => setChoice(200)}>
          200
        </Choice>
      </Choices>
      <Button onClick={mint}>
        {mintLoading ? 'Minting...' : 'Get Tokens'}
      </Button>
    </Container>
  );
};
const Choice = styled.div<{ isActive: boolean }>`
  padding: 0.75rem 1.25rem;
  border-radius: 0.3rem;
  border: 2px solid
    ${({ theme, isActive }) =>
      isActive ? theme.colors.secondary : theme.background.border};
  cursor: pointer;
`;

const Choices = styled.div`
  display: flex;
  gap: 1rem;
`;

const Container = styled.div`
  min-height: calc(100vh - 62px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  margin-top: 1rem;
  padding: 1.5rem;
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

export default Faucet;
