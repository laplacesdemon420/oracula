import { DisputeType } from '../types';

export const mockDisputes: DisputeType[] = [
  {
    questionString:
      'will the market cap of ETH be higher than BTC on 2023-01-01?',
    questionId: '245656789987654321',
    phase: 'COMMIT',
    nextPhase: 1000,
  },
  {
    questionString:
      'will the market cap of SOL be higher than ADA on 2023-01-01?',
    questionId: '123456789987654321',
    phase: 'REVEAL',
    nextPhase: 10000,
  },
  {
    questionString:
      'will the market cap of SOL be higher than ADA on 2023-01-01?',
    questionId: '123456789987654321',
    phase: 'FINALIZED',
    nextPhase: 10000,
  },
  {
    questionString:
      'will the market cap of SOL be higher than ADA on 2023-01-01?',
    questionId: '123456789987654321',
    phase: 'COMMIT',
    nextPhase: 10000,
  },
  {
    questionString:
      'will the market cap of SOL be higher than ADA on 2023-01-01?',
    questionId: '123456789987654321',
    phase: 'COMMIT',
    nextPhase: 10000,
  },
];
