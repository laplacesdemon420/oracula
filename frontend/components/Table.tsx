import type { NextPage } from 'next';
import { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import { Question } from '../types';
import { mockQuestions } from '../data/questions';

const columnHelper = createColumnHelper<Question>();

const columns = [
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
];

export default function Table() {
  const [data, setData] = useState(() => [...mockQuestions]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
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
  min-height: calc(100vh - 62px);
  display: flex;
  justify-content: center;
  /* border: 1px solid ${({ theme }) => theme.text.primary}; */
  margin-bottom: 2rem;
`;
