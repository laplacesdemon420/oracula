import type { NextPage } from 'next';
import styled from 'styled-components';
import { useForm, SubmitHandler } from 'react-hook-form';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import Table from '../components/Table';
import { Question } from '../types';

const Questions: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Question>();
  const onSubmit: SubmitHandler<Question> = (data) => console.log(data);

  return (
    <Container>
      <Ask>
        <h1>ASK ANY QUESTION!</h1>
        {/* "handleSubmit" will validate your inputs before invoking "onSubmit"  */}
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <input
            className="question"
            placeholder="what question do you wanna ask?"
            {...(register('questionString'), { required: true })}
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
            <Question className="source">
              <label>Resolution source:</label>
              <input
                className="resolution-source"
                {...register('resolutionSource', { required: true })}
              />
            </Question>

            <Question>
              <label>Resolution date:</label>
              <input
                className="resolution-date"
                type="date"
                {...register('resolutionDate', { required: true })}
              />
            </Question>
          </Resolution>
          {errors.resolutionSource && <span>This field is required</span>}
          <Button type="submit">submit question</Button>
        </StyledForm>
      </Ask>
      <TableContainer>
        <h2>Questions</h2>
        <Table />
      </TableContainer>
    </Container>
  );
};

const TableContainer = styled.div`
  width: 90%;
  margin-top: 2rem;
`;

const OutcomeDiv = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid ${({ theme }) => theme.text.primary};
  border-radius: 10px;
  padding: 0.5rem;

  .upper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: ${({ theme }) => theme.typeScale.header6};
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${({ theme }) => theme.text.primary};
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

const StyledForm = styled.form`
  width: 100%;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .question {
    padding: 0.75rem;
    border-radius: 10px;
    border: 2px solid ${({ theme }) => theme.text.primary};
    font-size: ${({ theme }) => theme.typeScale.paragraph};
  }

  .outcomes {
    font-size: ${({ theme }) => theme.typeScale.paragraph};
  }
`;

const Question = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  label {
    font-size: ${({ theme }) => theme.typeScale.smallParagraph};
    font-weight: 800;
  }

  .resolution-source {
    padding: 0.5rem;
    border-radius: 10px;
    border: 2px solid ${({ theme }) => theme.text.primary};
  }

  .resolution-date {
    padding: 0.5rem;
    border-radius: 10px;
    border: 2px solid ${({ theme }) => theme.text.primary};
  }
`;

const Resolution = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
`;

const Container = styled.div`
  min-height: calc(100vh - 62px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const Ask = styled.div`
  width: 50%;
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
`;

export default Questions;

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
