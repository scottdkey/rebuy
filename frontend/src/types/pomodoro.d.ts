
interface ICreatePomodoro {
  nickname: string
  timerTime: number
  shortBreakTime: number
  longBreakTime: number
}
interface IUpdatePomodoro extends ICreatePomodoro {
  id: string
}

interface IPomodoro extends IUpdatePomodoro {
  userId: string
  createdAt: string
  updatedAt: string
}
