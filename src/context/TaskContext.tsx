import { createContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../axios';

export interface TasksResponse {
  pages: number;
  tasks: Task[];
}

export interface Task {
  id: number;
  username: string;
  email: string;
  description: string;
  completed: boolean;
}

interface TaskContextProps {
  tasks: Task[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  goPage: (page: number) => Promise<void>;
  setSort: (sortBy: string) => Promise<void>;
}

export const TaskContext = createContext<TaskContextProps>({
  tasks: [],
  currentPage: 1,
  totalPages: 0,
  loading: false,
  addTask: async () => {},
  updateTask: async () => {},
  goPage: async () => {},
  setSort: async () => {},
});

export const TaskProvider = ({children}: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentSort, setCurrentSort] = useState<string>('id');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTasks = async () => {
    setLoading(true);
    const response = await apiClient.get<TasksResponse>(`/tasks?page=${currentPage}&sort_by=${currentSort}`);
    setTasks(response.data.tasks);
    setTotalPages(response.data.pages)
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [currentPage, currentSort]);

  const addTask = async (task: Partial<Task>): Promise<void> => {
    await apiClient.post<Task>('/tasks', task);
    fetchTasks()
  };

  const updateTask = async (id: number, updates: Partial<Task>): Promise<void> => {
    await apiClient.put<Task>(`/tasks/${id}`, updates);
    fetchTasks()
  };

  const goPage = async (page: number) => {
    setCurrentPage(page);
  }

  const setSort = async (sortBy: string = 'id') => {
    setCurrentSort(sortBy);
  }

  return (
    <TaskContext.Provider value={{tasks, loading, addTask, updateTask, currentPage, totalPages, goPage, setSort}}>
      {children}
    </TaskContext.Provider>
  );
};
