import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

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
  queryKey: [`pomodoro-${id}`],
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
  onError: (err: AxiosError<Message>) => {
    alert(JSON.stringify(err.response?.data.message, null, 2) || err.message);
  }
})
export const useUpdateTaskMutation = (id?: string) => useMutation({
  mutationFn: async (data: IUpdateTask) => {
    const res = await axios.patch<ITask>(`http://localhost:3000/task/${id}`, data, {
      withCredentials: true
    })
    return res.data
  },
  onError: (err: AxiosError<Message>) => {
    alert(JSON.stringify(err.response?.data.message, null, 2) || err.message);
  }
})
export const useDeleteTaskMutation = (id?: string) => useMutation({
  mutationFn: async () => {
    const res = await axios.delete<boolean>(`http://localhost:3000/task/${id}`, {
      withCredentials: true
    })
    return res.data
  },
  onError: (err: AxiosError<Message>) => {
    alert(JSON.stringify(err.response?.data.message, null, 2) || err.message);
  }
})