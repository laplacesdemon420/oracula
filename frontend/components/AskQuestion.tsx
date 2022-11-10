import type { NextPage } from 'next';
import styled from 'styled-components';
import { ethers } from 'ethers';
import {
  useContract,
  useContractRead,
  useNetwork,
  useQuery,
  useSigner,
} from 'wagmi';
import { useForm, SubmitHandler } from 'react-hook-form';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import OptimisticOracle from '../../contracts/out/OptimisticOracle.sol/OptimisticOracle.json';
import { addresses } from '../utils';
import { QuestionType } from '../types';
import { useState } from 'react';
import Link from 'next/link';

export default function AskQuestion() {
  const [askQuestionLoading, setAskQuestionLoading] = useState(false);
  const [askedQuestion, setAskedQuestion] = useState('');
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const activeChain = chain?.network;

  const optimisticOracle = useContract({
    address: addresses[activeChain ? activeChain : 'bittorrent'].oo,
    abi: OptimisticOracle.abi,
    signerOrProvider: signer,
  });

  const { register, handleSubmit, watch, formState } = useForm<QuestionType>();
  const onSubmit: SubmitHandler<QuestionType> = async (data) => {
    if (!optimisticOracle) return;

    const question = [
      data.questionString.toLowerCase(),
      data.resolutionSource.toLowerCase(),
      ethers.BigNumber.from(new Date(data.resolutionDate).getTime() / 1000),
    ];

    const questionId = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['string', 'string', 'uint'],
        [
          data.questionString.toLowerCase(),
          data.resolutionSource.toLowerCase(),
          ethers.BigNumber.from(
            new Date(data.resolutionDate).getTime() / 1000
          ).toString(),
        ]
      )
    );

    setAskQuestionLoading(true);
    try {
      let tx = await optimisticOracle.askQuestion(...question);
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
    setAskQuestionLoading(false);

    setAskedQuestion(questionId.slice(2));
    setTimeout(() => {
      setAskedQuestion('');
    }, 15000);

    // now the created question should be added to the top of the table
    // maybe, just trigger a rerender?
  };

  return (
    <Ask>
      <h1>ASK ANY QUESTION!</h1>
      {/* "handleSubmit" will validate your inputs before invoking "onSubmit"  */}
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <input
          className="question"
          placeholder="what question do you wanna ask?"
          {...register('questionString', { required: true })}
        />
        <p className="outcomes">Possible outcomes:</p>
        <OutcomeDiv>
          <p className="upper">
            <RiCheckboxBlankCircleFill />
            Yes
          </p>
          <p className="lower">
            <RiCheckboxBlankCircleFill />
            No
          </p>
        </OutcomeDiv>
        <Resolution>
          <StyledQuestion className="source">
            <label>Resolution source:</label>
            <input
              className="resolution-source"
              {...register('resolutionSource', { required: true })}
            />
          </StyledQuestion>

          <StyledQuestion>
            <label>Resolution date:</label>
            <input
              className="resolution-date"
              type="date"
              {...register('resolutionDate', { required: true })}
            />
          </StyledQuestion>
        </Resolution>
        {formState.errors.resolutionSource && (
          <span>This field is required</span>
        )}
        <Button type="submit">
          {!askQuestionLoading ? 'submit question' : 'loading...'}
        </Button>
        {askedQuestion !== '' && (
          <Link href={`/questions/${askedQuestion}`}>
            <a>Go to question</a>
          </Link>
        )}
      </StyledForm>
    </Ask>
  );
}

const OutcomeDiv = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid ${({ theme }) => theme.background.border};
  border-radius: 10px;
  padding: 0.5rem;

  .upper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: ${({ theme }) => theme.typeScale.header6};
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${({ theme }) => theme.background.border};
    font-weight: 500;
    svg {
      color: ${({ theme }) => theme.colors.green};
    }
  }
  .lower {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: ${({ theme }) => theme.typeScale.header6};
    font-weight: 500;
    padding-top: 0.5rem;
    svg {
      color: ${({ theme }) => theme.colors.red};
    }
  }
`;

const StyledQuestion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  label {
    font-size: ${({ theme }) => theme.typeScale.smallParagraph};
    font-weight: 800;
  }

  .resolution-source {
    padding: 9px;
    border-radius: 10px;
  }

  .resolution-date {
    padding: 8px;
    border-radius: 10px;
  }
`;

const Resolution = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
`;

const Ask = styled.div`
  width: 600px;
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-weight: 800;
    font-size: 2.25rem;
  }

  p {
    font-weight: 800;
    font-size: 1.5rem;
  }

  input {
    background: ${({ theme }) => theme.background.input};
    border: 2px solid ${({ theme }) => theme.background.border};
    color: ${({ theme }) => theme.text.primary};
  }

  @media screen and (max-width: 700px) {
    width: 80%;
  }
`;

const StyledForm = styled.form`
  width: 100%;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .question {
    padding: 0.75rem;
    border-radius: 10px;
    /* border: 2px solid ${({ theme }) => theme.text.primary}; */
    font-size: ${({ theme }) => theme.typeScale.paragraph};
  }

  .outcomes {
    font-size: ${({ theme }) => theme.typeScale.smallParagraph};
  }

  a {
    font-weight: 600;
    font-size: 1.25rem;
    cursor: pointer;
    :hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
  @media screen and (max-width: 700px) {
    /* width: 80%; */
  }
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
