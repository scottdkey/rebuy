import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HandleAxiosError } from "../util/HandleAxiosError.util.ts";

export const useGetAllTasks = () => useQuery({
  queryKey: ['tasks'],
  queryFn: async () => {
    const res = await axios.get<ITask[]>('http://localhost:3000/task', {
      withCredentials: true
    })
    return res.data
  }
})
export const useGetTaskById = (id?: string) => useQuery({
  queryKey: [`task-${id}`],
  queryFn: async () => {
    const res = await axios.get<ITask>(`http://localhost:3000/task/${id}`, {
      withCredentials: true
    })
    return res.data
  },
  enabled: id !== undefined
})

export const useCreateTaskMutation = () => useMutation({
  mutationFn: async (data: ICreateTask) => {
    const res = await axios.post<ITask>(`http://localhost:3000/task`, data, {
      withCredentials: true
    })
    return res.data
  },
  onError: HandleAxiosError
})
export const useUpdateTaskMutation = (id?: string) => useMutation({
  mutationFn: async (data: IUpdateTask) => {
    const res = await axios.patch<ITask>(`http://localhost:3000/task/${id}`, data, {
      withCredentials: true
    })
    return res.data
  },
  onError: HandleAxiosError
})
export const useDeleteTaskMutation = (id?: string) => useMutation({
  mutationFn: async () => {
    const res = await axios.delete<boolean>(`http://localhost:3000/task/${id}`, {
      withCredentials: true
    })
    return res.data
  },
  onError: HandleAxiosError
})