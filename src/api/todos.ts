import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

export function getAll(): Promise<Todo[]> {
  return axios.get('/todos').then((res) => res.data);
}

export async function getOne(todoId: string): Promise<Todo[]> {
  const response = await axios.get(`/todos/${todoId}`);

  return response.data;
}

export function add(title: string): Promise<Todo> {
  return axios.post('/todos', { title }).then((res) => res.data);
}

export function remove(todoId: string): Promise<string> {
  return axios.delete(`/todos/${todoId}`).then((res) => res.data);
}

export function update({ id, title, completed }: Todo): Promise<Todo> {
  return axios.put(`todos/${id}`, { title, completed }).then((res) => res.data);
}

//updatedAll - для обновления сразу нескольких todo,
// для этого принимаем массив todos в свойстве items(body -  {items: todos})
//Для этого - axios.patch
export function updateAll(todos: Todo[]): Promise<Todo[]> {
  return axios
    .patch('/todos?action=update', { items: todos })
    .then((res) => res.data);
}

export function removeAll(ids: string[]): Promise<Todo[]> {
  return axios
    .patch('/todos?action=delete', { ids: ids })
    .then((res) => res.data);
}
