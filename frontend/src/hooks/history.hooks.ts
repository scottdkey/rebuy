import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HandleAxiosError } from "../util/HandleAxiosError.util.ts";
import { backendURL } from "../util/constants.ts";



export const useGetAllHistory = () => useQuery({
  queryKey: ['history'],
  queryFn: async () => {
    const res = await axios.get<IHistory[]>(`${backendURL}/history`, {
      withCredentials: true
    })
    return res.data
  }
})
export const useGetHistoryById = (id?: string) => useQuery({
  queryKey: [`history-${id}`],
  queryFn: async () => {
    const res = await axios.get<IHistory>(`${backendURL}/history/${id}`, {
      withCredentials: true
    })
    return res.data
  },
  enabled: id !== undefined
})

export const useCreateHistoryMutation = () => useMutation({
  mutationFn: async (data: ICreateHistory) => {
    const res = await axios.post<IHistory>(`${backendURL}/history`, data, {
      withCredentials: true
    })
    return res.data
  },
  onError: HandleAxiosError
})
export const useUpdateHistoryMutation = (id?: string) => useMutation({
  mutationFn: async (data: IUpdateHistory) => {
    const res = await axios.patch<IHistory>(`${backendURL}/history/${id}`, data, {
      withCredentials: true
    })
    return res.data
  },
  onError: HandleAxiosError
})
export const useDeleteHistoryMutation = (id?: string) => useMutation({
  mutationFn: async () => {
    const res = await axios.delete<boolean>(`${backendURL}/history/${id}`, {
      withCredentials: true
    })
    return res.data
  },
  onError: HandleAxiosError
})