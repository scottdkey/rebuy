interface ICreateHistory {
  startTime: string //iso8601
}

interface IUpdateHistory {
  endTime: string | null //iso8601
  completedTasks: ICreateTask[] // create information structure is all the information needed for this value
  pauses: string[] // an array of iso8601 timestamps
}

interface IHistory extends ICreateHistory extends IUpdateHistory {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
}