import {
  useDeletePomodoroMutation,
  useGetAllPomodoros,
  useGetPomodoroById,
} from "../../hooks/pomodoro.hooks.ts";
import { usePomodoroStore } from "../../stores/pomoodoro.store.ts";
import Modal from "../Modal/Modal.tsx";
import styles from "./pomodoro.module.css";
import { PomodoroCreateOrUpdateForm } from "./PomodoroCreateOrUpdateForm.tsx";

// all logic for the pomodoro is contained in this component
// if no id is passed it will be treated as only a create form
export const Pomodoro = ({ id }: { id?: string }) => {
  const { refetch: refetchAll } = useGetAllPomodoros();
  const { data: pomodoro, isLoading } = useGetPomodoroById(id);
  const setActive = usePomodoroStore((state) => state.setActive);
  const active = usePomodoroStore((state) => state.active);
  const { mutateAsync: deletePomodoro } = useDeletePomodoroMutation(id);

  if (id === undefined) {
    return (
      <Modal btnLabel="create new">
        <span className={styles.container}>
          <h2>create</h2>
          <PomodoroCreateOrUpdateForm />
        </span>
      </Modal>
    );
  }

  if (isLoading) {
    return <div className={styles.container}>loading</div>;
  }

  if (pomodoro) {
    return (
      <div className={styles.pomodoroContainer}>
        <span className={styles.nickname}>{pomodoro.nickname}</span>
        <Modal btnLabel="edit">
          <span className={styles.container}>
            <h2>edit</h2>
            <PomodoroCreateOrUpdateForm id={id} />
          </span>
        </Modal>
        <button
          className={`${styles.btn} ${
            active && active.id === id ? styles.activeBtn : ""
          } `}
          onClick={() => {
            try {
              setActive(pomodoro);
            } catch (e) {
              console.error(e, " unable to set active");
            }
          }}
        >
          set active
        </button>

        <button
          // if no id is found, don't present the option to delete
          hidden={id === undefined}
          className={styles.btn}
          onClick={async () => {
            await deletePomodoro();
            await refetchAll();
            // if current active item is the one being deleted, remove it
            if (active && active.id === id) {
              setActive(null);
            }
          }}
        >
          delete
        </button>
      </div>
    );
  }

  return <>something went wrong</>;
};
