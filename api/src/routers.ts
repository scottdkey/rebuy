import authRouter from "./auth/auth.router.js";
import historyRouter from "./history/history.router.js";
import pomodoroRouter from "./pomodoro/pomodoro.router.js";
import taskRouter from "./task/task.router.js";
import userRouter from "./user/user.router.js";

export const routers = [
  { path: "/user", router: userRouter },
  { path: "/pomodoro", router: pomodoroRouter },
  { path: "/task", router: taskRouter },
  { path: "/auth", router: authRouter },
  { path: "/history", router: historyRouter },
]
