import { useQuery } from 'react-query';

type State = 'all' | 'open' | 'done';
type Todo = {
  id: number;
  state: State;
};
type Todos = ReadonlyArray<Todo>;

const fetchTodos = async (state: State): Promise<Todos> => {
  const response = await fetch(`todos/${state}`);
  return response.json();
};

export const useTodosQuery = (state: State) =>
  useQuery(['todos', state], () => fetchTodos(state));

export default function RQuery() {}
