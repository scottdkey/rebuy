import { create } from 'zustand'

// not including all of history as just the Id is needed to be shared
interface HistoryState {
  historyId: string | undefined
  setHistoryId: (id: string) => void
}


// this store isn't persisting as this should be created every time we hit start, saving it isn't important beyond a session
export const useHistoryStore = create<HistoryState>()(
  (set) => ({
    historyId: undefined,
    setHistoryId: (historyId) => { set({ historyId }) }
  }),
)