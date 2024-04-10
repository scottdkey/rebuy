import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HandleAxiosError } from "../util/HandleAxiosError.util.ts";
import { backendURL } from "../util/constants.ts";

export const useGetAllTasks = () => useQuery({
  queryKey: ['tasks'],
  queryFn: async () => {
    const res = await axios.get<ITask[]>(`${backendURL}/task`, {
      withCredentials: true
    })
    return res.data
  }
})
export const useGetTaskById = (id?: string) => useQuery({
  queryKey: [`task-${id}`],
  queryFn: async () => {
    const res = await axios.get<ITask>(`${backendURL}/task/${id}`, {
      withCredentials: true
    })
    return res.data
  },
  enabled: id !== undefined
})

export const useCreateTaskMutation = () => useMutation({
  mutationFn: async (data: ICreateTask) => {
    const res = await axios.post<ITask>(`${backendURL}/task`, data, {
      withCredentials: true
    })
    return res.data
  },
  onError: HandleAxiosError
})
export const useUpdateTaskMutation = (id?: string) => useMutation({
  mutationFn: async (data: IUpdateTask) => {
    const res = await axios.patch<ITask>(`${backendURL}/task/${id}`, data, {
      withCredentials: true
    })
    return res.data
  },
  onError: HandleAxiosError
})
export const useDeleteTaskMutation = (id?: string) => useMutation({
  mutationFn: async () => {
    const res = await axios.delete<boolean>(`${backendURL}/task/${id}`, {
      withCredentials: true
    })
    return res.data
  },
  onError: HandleAxiosError
})