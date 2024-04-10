import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware';
import { backendURL } from '../util/constants.ts';

interface AuthState {
  auth: boolean
  user: JwtPayload | null
  setUser: (user: JwtPayload) => void;
  removeUser: () => void
}

//use zustand stores that persist to local storage(default)
// this helps prevent flicker on the frontend, and ensures state is saved locally for faster response
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        auth: false,
        user: null,
        setUser: (user) => set({ user, auth: true }),
        removeUser: () => {
          localStorage.clear();
          fetch(`${backendURL}/auth/logout`).then(res => console.log(res.text))
          set({ user: null, auth: false })
        }
      }),
      {
        name: 'auth-storage',
      }
    )
  )
)