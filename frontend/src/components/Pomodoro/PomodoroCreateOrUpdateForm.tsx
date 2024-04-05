import {
  useGetPomodoroById,
  useGetAllPomodoros,
  useUpdatePomodoroMutation,
  useCreatePomodoroMutation,
} from "../../hooks/pomodoro.hooks.ts";
import { usePomodoroStore } from "../../stores/pomoodoro.store.ts";
import styles from "./pomodoro.module.css";

export const PomodoroCreateOrUpdateForm = ({ id }: { id?: string }) => {
  const { refetch, data: pomodoro } = useGetPomodoroById(id);
  const active = usePomodoroStore((state) => state.active);
  const setActive = usePomodoroStore((state) => state.setActive);
  const { refetch: refetchAll } = useGetAllPomodoros();
  const { mutateAsync: updatePomodoro } = useUpdatePomodoroMutation(id);
  const { mutateAsync: createPomodoro } = useCreatePomodoroMutation();

  //allowing default for this exercise, in a real world app, ideally the modal would simply close and refetch data
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      nickname: e.currentTarget.nickname.value,
      timerTime: parseInt(e.currentTarget.timerTime.value),
      shortBreakTime: parseInt(e.currentTarget.shortBreakTime.value),
      longBreakTime: parseInt(e.currentTarget.longBreakTime.value),
    };
    if (id) {
      const res = await updatePomodoro({ ...data, id });
      await refetch();
      await refetchAll();
      if (active && id === active.id) {
        console.log("update active");
        setActive(res);
      }
    }
    if (!id) {
      await createPomodoro(data);
      await refetchAll();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <p>all timers are in seconds</p>
      <label htmlFor="nickname">nickname</label>
      <input
        className={styles.input}
        name="nickname"
        required
        defaultValue={pomodoro?.nickname || ""}
      />
      <label htmlFor="timerTime">timer time</label>
      <input
        defaultValue={pomodoro?.timerTime || 1500}
        className={styles.input}
        name="timerTime"
        type="number"
        required
      />
      <label htmlFor="shortBreakTime">short break time</label>
      <input
        defaultValue={pomodoro?.shortBreakTime || 300}
        className={styles.input}
        name="shortBreakTime"
        type="number"
        required
      />
      <label htmlFor="longBreakTime">long break time</label>
      <input
        defaultValue={pomodoro?.longBreakTime || 900}
        className={styles.input}
        name="longBreakTime"
        type="number"
        required
      />
      <button>submit</button>
    </form>
  );
};
