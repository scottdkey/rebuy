import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../stores/auth.store.ts";


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