import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuthStore } from "../stores/auth.store.ts";
import { useNavigate } from "react-router-dom";
import { HandleAxiosError } from "../util/HandleAxiosError.util.ts";
import { backendURL } from "../util/constants.ts";

export const useSignInMutation = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const removeUser = useAuthStore((state) => state.removeUser);
  const nav = useNavigate();
  return useMutation({
    mutationFn: async (signInUser: ISignInUser) => {
      const res = await axios.post<JwtPayload>(
        `${backendURL}/auth/signin`,
        signInUser, {
        withCredentials: true
      });
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data);
      nav("/timers");
    },
    onError: (err: AxiosError<Message>) => {
      HandleAxiosError(err)
      removeUser();
    },
  })
};

