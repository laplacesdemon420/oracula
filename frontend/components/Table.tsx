import type { NextPage } from 'next';
import styled from 'styled-components';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Question } from '../types';
import { useReducer, useState } from 'react';
import { mockQuestions } from '../data/questions';

const columnHelper = createColumnHelper<Question>();

const columns = [
  columnHelper.accessor('questionString', {
    header: () => <span>Question</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.resolutionSource, {
    id: 'resolutionSource',
    header: () => <span>Resolution Source</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor('resolutionDate', {
    header: () => <span>Resolution Date</span>,
    cell: (info) => info.renderValue(),
  }),
];

export default function Table() {
  const [data, setData] = useState(() => [...mockQuestions]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Container>
      <StyledTable>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
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
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
      <div className="h-4" />
    </Container>
  );
}

const StyledTable = styled.table`
  th {
    padding-top: 1rem;
    text-align: left;
  }
  tr {
    height: 5px;
    /* line-height: 10px; */
  }
  td {
    /* height: 10px; */
  }
`;

const Container = styled.div`
  min-height: calc(100vh - 62px);
  display: flex;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.text.primary};
  margin-bottom: 2rem;
`;
