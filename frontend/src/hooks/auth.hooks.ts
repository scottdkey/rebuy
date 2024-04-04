import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../stores/auth.store.ts";
import { useNavigate } from "react-router-dom";

export const useSignInMutation = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const removeUser = useAuthStore((state) => state.removeUser);
  const nav = useNavigate();
  return useMutation({
    mutationFn: async (signInUser: ISignInUser) => {
      const res = await axios.post<JwtPayload>(
        "http://localhost:3000/auth/signin",
        signInUser, {
        withCredentials: true
      }
      );
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data);
      nav("/timers");
    },
    onError: (err) => {
      console.error(err, "unable to sign in");
      removeUser();
      alert("unable to sign in, please double check username and password");
    },
  })
};
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
    onError: (err) => {
      console.error(err, "unable to sign in");
      removeUser();
      alert(err.message);
    },
  })
};
