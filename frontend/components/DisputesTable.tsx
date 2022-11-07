import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  FilterFn,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import { DisputeType, QuestionType } from '../types';
import { mockDisputes } from '../data/disputes';
import { useContractRead } from 'wagmi';
import OptimisticOracle from '../../contracts/out/OptimisticOracle.sol/OptimisticOracle.json';
import { addresses } from '../../contracts/addresses';

const columnHelper = createColumnHelper<DisputeType>();

const columns = [
  columnHelper.accessor('questionString', {
    header: () => <span>Question</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('questionId', {
    header: () => <span>Question ID</span>,
    cell: (info) => '<questionId>',
  }),
  columnHelper.accessor('phase', {
    header: () => <span>Phase</span>,
    cell: (info) => '<phase>',
  }),
  columnHelper.accessor('nextPhase', {
    header: () => <span>Next Phase</span>,
    cell: (info) => '<nextPhase>',
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

export default function DisputesTable() {
  const [data, setData] = useState<DisputeType[]>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const { data: questions } = useContractRead({
    address: addresses.goerli.oo,
    abi: OptimisticOracle.abi,
    functionName: 'getAllQuestions',
    select: (data: any) => {
      return data
        .filter((q: any) => q.stage === 2)
        .map((q: any) => {
          return {
            questionString: q.questionString,
            resolutionSource: q.resolutionSource,
            resolutionDate: q.expiry.toString(),
            stage: q.stage,
            result: q.result,
          };
        })
        .reverse();
    },
  });

  // questionId can be derived on frontend

  // get votes here, dependent on questions query
  // votes will give use the phases

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
      });
    } else if (window.innerWidth < 1100) {
      setColumnVisibility({
        questionString: true,
        stage: true,
        resolutionDate: true,
        resolutionSource: false,
      });
    } else {
      setColumnVisibility({
        questionString: true,
        stage: true,
        resolutionDate: true,
        resolutionSource: true,
      });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setData(questions as DisputeType[]);
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
          {table.getRowModel().rows.map((row) => (
            <tr className={row.id} key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td className={cell.column.id} key={cell.id}>
                  <div className={cell.column.id === 'stage' ? 'stage' : ''}>
                    {cell.column.id === 'stage' ? (
                      <RiCheckboxBlankCircleFill />
                    ) : null}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </td>
              ))}
            </tr>
          ))}
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
      /* border-radius: 10px 10px 0 0; */
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
