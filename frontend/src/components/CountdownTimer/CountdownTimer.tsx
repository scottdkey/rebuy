import { useState, useEffect } from "react";
import { usePomodoroStore } from "../../stores/pomoodoro.store.ts";
import { formatTime } from "../../util/formatTimeForTimers.util.ts";
import styles from "./CountdownTimer.module.css";
import {
  useCreateHistoryMutation,
  useGetHistoryById,
  useUpdateHistoryMutation,
} from "../../hooks/history.hooks.ts";
import { HandleAxiosError } from "../../util/HandleAxiosError.util.ts";
import { useHistoryStore } from "../../stores/history.store.ts";

export const CountdownTimer = () => {
  // this state can be passed from anywhere, so there is no need to pass props around
  const active = usePomodoroStore((state) => state.active);
  const [timer, setTimer] = useState(active ? active.timerTime : 0);
  const [breakTimer, setBreakTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [breakIsRunning, setBreakIsRunning] = useState(false);
  const [longBreak, setLongBreak] = useState(0);
  const [shortBreak, setShortBreak] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // history will be created with timer is started, this will not run while undefined
  // this is in a store so the same value can be used in the Task component
  const historyId = useHistoryStore((s) => s.historyId);
  const setHistoryId = useHistoryStore((s) => s.setHistoryId);
  // when history id is populated this will automatically fetch
  const { data: history, refetch: refetchHistory } =
    useGetHistoryById(historyId);
  const { mutateAsync: createHistory } = useCreateHistoryMutation();
  const { mutateAsync: updateHistory } = useUpdateHistoryMutation(historyId);

  if (active === null) {
    return <div>please select or create an active item to proceed</div>;
  }

  // multiple use effects focusing on different event changes

  useEffect(() => {
    // if the active item changes, stop all timers
    setBreakIsRunning(false);
    setIsRunning(false);
    // set various local state to current active values
    setTimer(active.timerTime);
    setLongBreak(active.longBreakTime);
    setShortBreak(active.shortBreakTime);
  }, [active]);

  useEffect(() => {
    // handle timer countdowns based on running state
    let countdown: NodeJS.Timeout;
    let breakCountdown: NodeJS.Timeout;

    // base timer
    if (isRunning) {
      setIsPaused(false);
      countdown = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(countdown);
            // when timer completes send end time
            resetTimer();
            return 0;
          }
        });
      }, 1000);
    }

    //break timer
    if (breakIsRunning) {
      breakCountdown = setInterval(() => {
        setBreakTimer((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            setBreakIsRunning(false);
            setIsRunning(true);
            clearInterval(breakCountdown);
            return 0;
          }
        });
      }, 1000);
    }

    // ensure to clear the interval at the end of the use effect, this will happen on unmount
    return () => {
      clearInterval(countdown);
      clearInterval(breakCountdown);
    };
  }, [isRunning, breakIsRunning]);

  // in this component I've opted to have handlers for various logic, this ensures reusability from this scope
  const startOrResumeTimer = async () => {
    setIsPaused(false);
    setIsRunning(true);
    if (breakIsRunning) {
      setBreakIsRunning(false);
    }

    // if timer isn't running, create a new history
    // otherwise don't
    if (timer < active.timerTime === false) {
      await createHistory(
        {
          startTime: new Date().toISOString(),
        },
        {
          onSuccess: (data) => {
            setHistoryId(data.id);
          },
          onError: HandleAxiosError,
        }
      );
    }
  };

  const resetTimer = async () => {
    setIsRunning(false);
    setTimer(active.timerTime);
    // if timer is reset send endTime
    if (history) {
      await updateHistory({
        endTime: new Date().toISOString(),
        completedTasks: history.completedTasks,
        pauses: history.pauses,
      });
      refetchHistory();
    }
  };

  const takeShortBreak = async () => {
    await pauseTimer();
    setBreakTimer(shortBreak);
    setBreakIsRunning(true);
  };

  const takeLongBreak = async () => {
    await pauseTimer();
    setBreakTimer(longBreak);
    setBreakIsRunning(true);
  };

  const pauseTimer = async () => {
    setIsRunning(false);
    if (history && isPaused === false) {
      await updateHistory({
        endTime: null,
        completedTasks: history.completedTasks,
        pauses: [...history.pauses, new Date().toISOString()],
      });
      refetchHistory();
    }
    setIsPaused(true);
  };

  if (active) {
    return (
      <div className={styles.container}>
        <h3 className={`${styles.title}`}>{active?.nickname} timer</h3>
        <h2
          className={`${styles.baseRunning} ${
            isRunning ? styles.running : styles.stopped
          }`}
        >
          {/* format seconds to minutes and seconds */}
          {formatTime(timer)}
        </h2>
        <div className={styles.controlsContainer}>
          {/* toggle running states */}
          {!isRunning ? (
            <button onClick={startOrResumeTimer}>
              {/* resume if timer has started or start if it hasn't */}
              {timer < active.timerTime ? "resume" : "start"}
            </button>
          ) : (
            /**
             * reset to original timer setting
             */
            <button onClick={resetTimer}>Reset</button>
          )}
          {/* allow pauses expressed as a break */}
          {isRunning ? <button onClick={pauseTimer}>pause</button> : null}
          {/* if running but not on a break, or not on a break and the timer has started(i.e. paused) */}
          {(isRunning && breakIsRunning === false) ||
          (breakIsRunning === false && timer < active.timerTime) ? (
            <>
              <button onClick={takeShortBreak}>
                {/* take a short break */}
                short break: {formatTime(shortBreak)}
              </button>
              <button onClick={takeLongBreak}>
                {/* take a long break */}
                long break: {formatTime(longBreak)}
              </button>
            </>
          ) : null}
          {/* display break timer if break is running */}
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
