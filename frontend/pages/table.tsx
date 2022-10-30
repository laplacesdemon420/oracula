import type { NextPage } from 'next';
import styled from 'styled-components';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { QuestionType } from '../types';
import { useState } from 'react';
import { mockQuestions } from '../data/questions';

const columnHelper = createColumnHelper<QuestionType>();

const columns = [
  columnHelper.accessor('questionString', {
    header: () => <span>Question</span>,
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id, // questionString?
  }),
  columnHelper.accessor((row) => row.resolutionSource, {
    id: 'resolutionSource',
    header: () => <span>Resolution Source</span>,
    cell: (info) => <i>{info.getValue()}</i>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('resolutionDate', {
    header: () => <span>Resolution Date</span>,
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
];

const Table: NextPage = () => {
  const [data, setData] = useState(() => [...mockQuestions]);
  // const rerender = React.useReducer(() => ({}), {})[1]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log(table);
  console.log(table.getHeaderGroups());
  console.log(table.getRowModel());

  return (
    <Container>
      <div>ayo</div>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 10rem;
  min-height: calc(100vh - 62px);
  display: flex;
  justify-content: center;
`;

export default Table;
