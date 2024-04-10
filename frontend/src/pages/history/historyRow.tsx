import { Tooltip } from "react-tooltip";
import {
  useDeleteHistoryMutation,
  useGetAllHistory,
  useGetHistoryById,
} from "../../hooks/history.hooks.ts";
import { formatTime } from "../../util/formatTimeForTimers.util.ts";
import styles from "./history.module.css";

export const PomodoroHistoryRow = ({ id }: { id: string }) => {
  const { data: history, isLoading } = useGetHistoryById(id);
  const { refetch: refetchAllHistory } = useGetAllHistory();
  const { mutateAsync: deleteHistory } = useDeleteHistoryMutation(id);

  if (isLoading) {
    return (
      <div className={styles.rowContainer}>
        <div>...loading</div>
      </div>
    );
  }

  if (history) {
    const calculateSessionTime = () => {
      let startTime = new Date(history.startTime).valueOf();
      if (history.endTime === null) {
        return "Not Completed";
      }
      let endTime = new Date(history.endTime).valueOf();

      const diff = endTime - startTime;

      return formatTime(diff / 1000);
    };
    return (
      <div className={`${styles.rowContainer} history-${history.id}`}>
        {history.completedTasks.length > 0 ? (
          <Tooltip
            id={`history-${history.id}`}
            className={styles.tooltip}
            anchorSelect={`.history-${history.id}`}
          >
            <div className={styles.rowItem}>
              <h3>completed tasks</h3>
              {history.completedTasks.map((ct) => (
                <div key={ct.id}>
                  <div>
                    {ct.taskName}: {ct.description}
                  </div>
                </div>
              ))}
            </div>
          </Tooltip>
        ) : null}
        <div className={styles.rowItem}>
          <div>Session Time: {calculateSessionTime()}</div>
          <div>
            <div>
              Started: {new Date(history.startTime).toLocaleTimeString()}
            </div>
            {history.endTime !== null ? (
              <div>Ended: {new Date(history.endTime).toLocaleTimeString()}</div>
            ) : null}
          </div>
          <div>Times Paused: {history.pauses.length}</div>
          <div>Completed Tasks: {history.completedTasks.length}</div>
          <button
            className={styles.deleteButton}
            onClick={async () => {
              await deleteHistory();
              await refetchAllHistory();
            }}
          >
            delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.rowContainer}>
      <div>something went wrong</div>
    </div>
  );
};
