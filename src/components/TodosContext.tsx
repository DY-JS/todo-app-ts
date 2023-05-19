import React, { useEffect, useMemo, useState } from 'react';
import { Filter } from '../types/Filter';
import * as todosApi from '../api/todos';

type TodosContextType = {
  getAll: (type?: Filter) => Todo[];
  add: (title: string) => void;
  remove: (todoId: string) => void;
  update: (todoData: Todo) => void;
  toggleAll: (completed: boolean) => void;
  clearCompleted: () => void;
};

export const TodosContext = React.createContext<TodosContextType>({
  getAll: () => [],
  add: () => {},
  remove: () => {},
  update: () => {},
  clearCompleted: () => {},
  toggleAll: () => {},
});

export const TodosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const loadTodos = () => {
    todosApi.getAll().then(setTodos);
  };
  // const [todos, setTodos] = useState<Todo[]>(() => {
  //const data = window.localStorage.getItem('todos');
  //   return data ? JSON.parse(data) : [];
  // });

  // useEffect(() => {
  //   window.localStorage.setItem('todos', JSON.stringify(todos));
  // }, [todos]);
  useEffect(() => {
    loadTodos();
  }, []);

  const value = useMemo(
    () => ({
      add: async (title: string) => {
        const newTodo: Todo = await todosApi.add(title);
        setTodos([...todos, newTodo]);
      },

      remove: async (todoId: string) => {
        await todosApi.remove(todoId);
        loadTodos();
      },

      update: async (todoData: Todo) => {
        await todosApi.update(todoData);
        loadTodos();
        //await todosApi.update(todoData).then(loadTodos) как вариант
      },

      //чтобы выбрать всё completed или наоборот
      //вначале фильтруем всё что не соответств переданному пар-ру(всё что нужно обновить)
      // передаём в todosApi.updatedAll как массив
      toggleAll: (completed: boolean) => {
        todosApi
          .updateAll(
            todos
              .filter((todo) => todo.completed !== completed)
              .map((todo) => ({ ...todo, completed }))
          )
          .then(loadTodos);
      },

      // каждый todo из отфильтрованного обновляем с todosApi.update
      // поэтому применяем Promise.all
      // toggleAll: (completed: boolean) => {
      //   Promise.all(
      //     todos
      //       .filter((todo) => todo.completed !== completed)
      //       .map((todo) => todosApi.update({ ...todo, completed }))
      //   ).then(loadTodos);
      // },

      //удалить все выполненные
      clearCompleted: () => {
        todosApi
          .removeAll(
            todos.filter((todo) => todo.completed).map((todo) => todo.id)
          )
          .then(loadTodos);
      },

      // clearCompleted: () => {
      //   Promise.all(
      //     todos
      //       .filter((todo) => todo.completed)
      //       .map((todo) => todosApi.remove(todo.id))
      //   ).then(loadTodos);
      // },

      getAll: (type = Filter.all) => {
        switch (type) {
          case Filter.active:
            return todos.filter((todo) => !todo.completed);

          case Filter.completed:
            return todos.filter((todo) => todo.completed);

          default:
            return todos;
        }
      },
    }),
    [todos]
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
