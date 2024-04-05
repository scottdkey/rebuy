import { Pomodoro } from "../../components/Pomodoro/pomodoro.tsx";
import { useGetAllPomodoros } from "../../hooks/pomodoro.hooks.ts";
import { useAuthStore } from "../../stores/auth.store.ts";
import styles from "./timers.module.css";
import Modal from "../../components/Modal/Modal.tsx";
import { CountdownTimer } from "../../components/CountdownTimer/CountdownTimer.tsx";
import { PropsWithChildren } from "react";

export const Timers = () => {
  const isAuth = useAuthStore((state) => state.auth);
  const { data, isLoading } = useGetAllPomodoros();

  //using a base wrapper to cut down on repeated logic
  // this also makes updating the page easier as you can update the core layout in one spot
  const Base = (props: PropsWithChildren) => {
    return (
      <div className={styles.container}>
        <h1>pomodoro timers</h1>
        {props.children}
      </div>
    );
  };

  if (isAuth === false) {
    return (
      <Base>
        <p>You must be signed in to access this resource</p>
      </Base>
    );
  }

  // using various if statements we can setup various states for this component
  if (isLoading) {
    return (
      <Base>
        <h4>...loading</h4>
      </Base>
    );
  }

  if (isAuth && data === undefined) {
    return (
      <Base>
        <div>please select or create an active item to proceed</div>
      </Base>
    );
  }

  if (isAuth && data) {
    return (
      <Base>
        <div className={styles.controlsContainer}>
          <div className={styles.controlButton}>
            {/* include a base item that can create new pomodoro timers */}
            <Pomodoro />
          </div>
          <div className={styles.controlButton}>
            <Modal btnLabel="timer settings">
              {/* ensure that the data is exists and that the array is greater than 0 */}
              {data &&
                data.length > 0 &&
                data.map((p) => (
                  <div key={p.id}>
                    <Pomodoro id={p.id} />
                  </div>
                ))}
            </Modal>
          </div>
        </div>

        <CountdownTimer />
      </Base>
    );
  }
  return (
    <Base>
      <p>something went wrong</p>
    </Base>
  );
};
