import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface PomodoroState {
  active: IPomodoro | null
  setActive: (p: IPomodoro | null) => void
  running: boolean,
  setRunning: (v: boolean) => void

}

export const usePomodoroStore = create<PomodoroState>()(
  devtools(
    persist(
      (set) => ({
        active: null,
        setActive: (p) => set({ active: p }),
        running: false,
        setRunning: (v) => set({ running: v })

      }),
      {
        name: 'pomodoro-storage',
      }
    )
  )
)