import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HandleAxiosError } from "../util/HandleAxiosError.util.ts";



export const useGetAllHistory = () => useQuery({
  queryKey: ['history'],
  queryFn: async () => {
    const res = await axios.get<IPomodoro[]>('http://localhost:3000/history', {
      withCredentials: true
    })
    return res.data
  }
})
export const useGetPomodoroById = (id?: string) => useQuery({
  queryKey: [`history-${id}`],
  queryFn: async () => {
    const res = await axios.get<IPomodoro>(`http://localhost:3000/history/${id}`, {
      withCredentials: true
    })
    return res.data
  },
  enabled: id !== undefined
})

export const useCreatePomodoroMutation = () => useMutation({
  mutationFn: async (data: ICreatePomodoro) => {
    const res = await axios.post<IPomodoro>(`http://localhost:3000/history`, data, {
      withCredentials: true
    })
    return res.data
  },
  onError: HandleAxiosError
})
export const useUpdatePomodoroMutation = (id?: string) => useMutation({
  mutationFn: async (data: IUpdatePomodoro) => {
    const res = await axios.patch<IPomodoro>(`http://localhost:3000/history/${id}`, data, {
      withCredentials: true
    })
    return res.data
  },
  onError: HandleAxiosError
})
export const useDeletePomodoroMutation = (id?: string) => useMutation({
  mutationFn: async () => {
    const res = await axios.delete<boolean>(`http://localhost:3000/history/${id}`, {
      withCredentials: true
    })
    return res.data
  },
  onError: HandleAxiosError
})