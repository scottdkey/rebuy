import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuthStore } from "../stores/auth.store.ts";
import { useNavigate } from "react-router-dom";
import { HandleAxiosError } from "../util/HandleAxiosError.util.ts";


export const useGetCurrentUserQuery = () => {

  const setUser = useAuthStore(store => store.setUser)
  const removeUser = useAuthStore(store => store.removeUser)


  return useQuery({
    queryKey: ["getMe"],
    queryFn: async () => {
      const res = await axios.get<JwtPayload>("http://localhost:3000/user", {
        withCredentials: true
      })
      if (res.status === 200) {
        setUser(res.data)
        return res.data
      }
      if (res.status >= 400) {
        removeUser()
      }

    },
  })
}

export const useSignUpMutation = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const removeUser = useAuthStore((state) => state.removeUser);
  const nav = useNavigate();
  return useMutation({
    mutationFn: async (signUpUser: ISignUpUser) => {
      const res = await axios.post<JwtPayload>(
        "http://localhost:3000/user",
        signUpUser,
        {
          withCredentials: true
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data);
      nav("/timers");
    },
    onError: (err: AxiosError<Message>) => {
      removeUser();
      HandleAxiosError(err)
    },
  })
};