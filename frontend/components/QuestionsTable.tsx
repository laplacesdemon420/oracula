import type { NextPage } from 'next';
import { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  FilterFn,
} from '@tanstack/react-table';
import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import { QuestionType } from '../types';
import { mockQuestions } from '../data/questions';
import OptimisticOracle from '../../contracts/out/OptimisticOracle.sol/OptimisticOracle.json';
import { addresses } from '../../contracts/addresses';
import { useContractRead, useQuery } from 'wagmi';
import { ethers } from 'ethers';
import Link from 'next/link';
import { timestampToDate } from '../utils';

const columnHelper = createColumnHelper<QuestionType>();

const lightColumns: any = [
  columnHelper.accessor('questionString', {
    header: () => <span>Question</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.resolutionSource, {
    id: 'resolutionSource',
    header: () => <span>Resolution Source</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
];

const columns: any = [
  columnHelper.accessor('questionString', {
    header: () => <span>Question</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('stage', {
    header: () => <span>Stage</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.resolutionSource, {
    id: 'resolutionSource',
    header: () => <span>Resolution Source</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor('resolutionDate', {
    header: () => <span>Date</span>,
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('questionId', {
    header: () => <span>Question ID</span>,
    cell: (info) => info.renderValue(),
  }),
];

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export function LightTable() {
  const [data, setData] = useState<QuestionType[]>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  // get all questions here
  // const { data: questions } = useContractRead({
  //   address: addresses.goerli.oo,
  //   abi: OptimisticOracle.abi,
  //   functionName: 'getAllQuestions',
  //   select: (data: any) => {
  //     return data
  //       .map((q: any) => {
  //         return {
  //           questionString: q.questionString,
  //           resolutionSource: q.resolutionSource,
  //           resolutionDate: timestampToDate(q.expiry.toString(), 'seconds'),
  //           timestamp: q.expiry.toString(),
  //           stage: q.stage,
  //           result: q.result,
  //           questionId: q.questionId,
  //         };
  //       })
  //       .reverse();
  //   },
  //   watch: true,
  // });

  const table = useReactTable({
    data,
    columns: lightColumns,
    state: {
      columnVisibility,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    setData(mockQuestions.slice(0, 9) as QuestionType[]);
  }, []);

  return (
    <Container>
      <StyledTable>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className={header.id} key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const questionId = row.original.questionId.slice(2);
            // console.log('questionId:', questionId);
            return (
              <tr className={row.id} key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td className={cell.column.id} key={cell.id}>
                      <Link href={`/questions/${questionId}`}>
                        <a
                          className={cell.column.id === 'stage' ? 'stage' : ''}
                        >
                          {cell.column.id === 'stage' ? (
                            <RiCheckboxBlankCircleFill />
                          ) : null}
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </a>
                      </Link>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </Container>
  );
}

export default function Table() {
  const [data, setData] = useState<QuestionType[]>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  // get all questions here
  const { data: questions } = useContractRead({
    address: addresses.goerli.oo,
    abi: OptimisticOracle.abi,
    functionName: 'getAllQuestions',
    select: (data: any) => {
      return data
        .map((q: any) => {
          return {
            questionString: q.questionString,
            resolutionSource: q.resolutionSource,
            resolutionDate: timestampToDate(q.expiry.toString(), 'seconds'),
            timestamp: q.expiry.toString(),
            stage: q.stage,
            result: q.result,
            questionId: q.questionId,
          };
        })
        .reverse();
    },
    watch: true,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleResize = () => {
    console.log(window.innerWidth);

    if (window.innerWidth < 850) {
      setColumnVisibility({
        questionString: true,
        stage: true,
        resolutionDate: false,
        resolutionSource: false,
        questionId: false,
      });
    } else if (window.innerWidth < 1100) {
      setColumnVisibility({
        questionString: true,
        stage: true,
        resolutionDate: true,
        resolutionSource: false,
        questionId: false,
      });
    } else {
      setColumnVisibility({
        questionString: true,
        stage: true,
        resolutionDate: true,
        resolutionSource: true,
        questionId: false,
      });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setData(questions as QuestionType[]);
  }, [questions]);

  return (
    <Container>
      <Search>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="Search..."
        />
      </Search>
      <StyledTable>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className={header.id} key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const questionId = row.original.questionId.slice(2);
            // console.log('questionId:', questionId);
            return (
              <tr className={row.id} key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td className={cell.column.id} key={cell.id}>
                      <Link href={`/questions/${questionId}`}>
                        <a
                          className={cell.column.id === 'stage' ? 'stage' : ''}
                        >
                          {cell.column.id === 'stage' ? (
                            <RiCheckboxBlankCircleFill />
                          ) : null}
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </a>
                      </Link>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </Container>
  );
}

const Search = styled.div`
  input {
    padding: 0.75rem;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.background.tertiary};
    width: 20rem;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;

  thead {
    tr {
      border-radius: 10px 10px 0 0;
      outline: thin solid ${({ theme }) => theme.background.tertiary};
      background-color: ${({ theme }) => theme.background.secondary};
    }
    th {
      text-align: left;
      padding: 1rem;

      span {
        font-weight: 500;
      }
    }
  }

  tbody {
    tr {
      border-bottom: thin solid ${({ theme }) => theme.background.tertiary};
      border-left: thin solid ${({ theme }) => theme.background.tertiary};
      border-right: thin solid ${({ theme }) => theme.background.tertiary};
    }
    td {
      padding-left: 1rem;
      padding-top: 1rem;
      padding-bottom: 1rem;
      .stage {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        svg {
          color: ${({ theme }) => theme.colors.green};
        }
      }
    }
  }
`;

const Container = styled.div`
  /* min-height: calc(100vh - 62px); */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* align-items: center; */
  /* border: 1px solid ${({ theme }) => theme.text.primary}; */
  margin-bottom: 2rem;
`;

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
