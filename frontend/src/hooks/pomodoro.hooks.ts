import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";



export const useGetAllPomodoros = () => useQuery({
  queryKey: ['pomodoros'],
  queryFn: async () => {
    const res = await axios.get<IPomodoro[]>('http://localhost:3000/pomodoro', {
      withCredentials: true
    })
    return res.data
  }
})
export const useGetPomodoroById = (id?: string) => useQuery({
  queryKey: [`pomodoro-${id}`],
  queryFn: async () => {
    const res = await axios.get<IPomodoro>(`http://localhost:3000/pomodoro/${id}`, {
      withCredentials: true
    })
    return res.data
  },
  enabled: id !== undefined
})

export const useCreatePomodoroMutation = () => useMutation({
  mutationFn: async (data: ICreatePomodoro) => {
    const res = await axios.post<IPomodoro>(`http://localhost:3000/pomodoro`, data, {
      withCredentials: true
    })
    return res.data
  }
})
export const useUpdatePomodoroMutation = (id?: string) => useMutation({
  mutationFn: async (data: IUpdatePomodoro) => {
    const res = await axios.patch<IPomodoro>(`http://localhost:3000/pomodoro/${id}`, data, {
      withCredentials: true
    })
    return res.data
  }
})
export const useDeletePomodoroMutation = (id?: string) => useMutation({
  mutationFn: async () => {
    const res = await axios.delete<boolean>(`http://localhost:3000/pomodoro/${id}`, {
      withCredentials: true
    })
    return res.data
  }
})