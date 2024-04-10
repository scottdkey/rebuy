import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HandleAxiosError } from "../util/HandleAxiosError.util.ts";
import { backendURL } from "../util/constants.ts";



export const useGetAllPomodoros = () => useQuery({
  queryKey: ['pomodoros'],
  queryFn: async () => {
    const res = await axios.get<IPomodoro[]>(`${backendURL}/pomodoro`, {
      withCredentials: true
    })
    return res.data
  }
})
export const useGetPomodoroById = (id?: string) => useQuery({
  queryKey: [`pomodoro-${id}`],
  queryFn: async () => {
    const res = await axios.get<IPomodoro>(`${backendURL}/pomodoro/${id}`, {
      withCredentials: true
    })
    return res.data
  },
  enabled: id !== undefined
})

export const useCreatePomodoroMutation = () => useMutation({
  mutationFn: async (data: ICreatePomodoro) => {
    const res = await axios.post<IPomodoro>(`${backendURL}/pomodoro`, data, {
      withCredentials: true
    })
    return res.data
  },
  onError: HandleAxiosError
})
export const useUpdatePomodoroMutation = (id?: string) => useMutation({
  mutationFn: async (data: IUpdatePomodoro) => {
    const res = await axios.patch<IPomodoro>(`${backendURL}/pomodoro/${id}`, data, {
      withCredentials: true
    })
    return res.data
  },
  onError: HandleAxiosError
})
export const useDeletePomodoroMutation = (id?: string) => useMutation({
  mutationFn: async () => {
    const res = await axios.delete<boolean>(`${backendURL}/pomodoro/${id}`, {
      withCredentials: true
    })
    return res.data
  },
  onError: HandleAxiosError
})