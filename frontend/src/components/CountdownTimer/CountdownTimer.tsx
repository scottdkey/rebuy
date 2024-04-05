import { useState, useEffect } from "react";
import { usePomodoroStore } from "../../stores/pomoodoro.store.ts";
import { formatTime } from "../../util/formatTimeForTimers.util.ts";
import styles from "./CountdownTimer.module.css";

export const CountdownTimer = () => {
  // this state can be passed from anywhere, so there is no need to pass props around
  const active = usePomodoroStore((state) => state.active);
  const [timer, setTimer] = useState(active ? active.timerTime : 0);
  const [breakTimer, setBreakTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [breakIsRunning, setBreakIsRunning] = useState(false);

  if (active === null) {
    return <div>please select or create an active item to proceed</div>;
  }

  useEffect(() => {
    setBreakIsRunning(false);
    setIsRunning(false);
    setTimer(active.timerTime);
  }, [active]);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    let breakCountdown: NodeJS.Timeout;

    if (isRunning) {
      countdown = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            setIsRunning(false);
            clearInterval(countdown);
            return 0;
          }
        });
      }, 1000);
    }

    if (breakIsRunning) {
      breakCountdown = setInterval(() => {
        setBreakTimer((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            setBreakIsRunning(false);
            clearInterval(breakCountdown);
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(countdown);
      clearInterval(breakCountdown);
    };
  }, [isRunning, breakIsRunning]);

  if (active) {
    return (
      <div className={styles.container}>
        <h3 className={`${styles.title}`}>{active?.nickname} timer</h3>
        <h2
          className={`${styles.baseRunning} ${
            isRunning ? styles.running : styles.stopped
          }`}
        >
          {formatTime(timer)}
        </h2>
        <div className={styles.controlsContainer}>
          {!isRunning ? (
            <button
              onClick={() => {
                setIsRunning(true);
                if (breakIsRunning) {
                  setBreakIsRunning(false);
                }
              }}
            >
              {timer < active.timerTime ? "resume" : "start"}
            </button>
          ) : (
            <button
              onClick={() => {
                setIsRunning(false);
                setTimer(active.timerTime);
              }}
            >
              Reset
            </button>
          )}
          {isRunning ? (
            <button
              onClick={() => {
                setIsRunning(false);
              }}
            >
              pause
            </button>
          ) : null}
          {(isRunning && breakIsRunning === false) ||
          (breakIsRunning === false && timer < active.timerTime) ? (
            <>
              <button
                onClick={() => {
                  setIsRunning(false);
                  setBreakTimer(active.shortBreakTime);

                  setBreakIsRunning(true);
                }}
              >
                short break: {formatTime(active.shortBreakTime)}
              </button>
              <button
                onClick={() => {
                  setIsRunning(false);
                  setBreakTimer(active.longBreakTime);

                  setBreakIsRunning(true);
                }}
              >
                long break: {formatTime(active.longBreakTime)}
              </button>
            </>
          ) : null}
          {breakIsRunning ? (
            <>
              <h4 className={styles.centered}>time left in break</h4>
              <h3
                className={`${styles.centered} ${styles.baseRunning} ${
                  breakIsRunning ? styles.running : styles.stopped
                }`}
              >
                {formatTime(breakTimer)}
              </h3>
            </>
          ) : null}
        </div>
      </div>
    );
  }
};
