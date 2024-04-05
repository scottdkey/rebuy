import { PropsWithChildren } from "react";
import {
  useDeleteHistoryMutation,
  useGetAllHistory,
  useGetHistoryById,
} from "../../hooks/history.hooks.ts";
import styles from "./history.module.css";
import { formatTime } from "../../util/formatTimeForTimers.util.ts";
import { Tooltip } from "react-tooltip";
import { useAuthStore } from "../../stores/auth.store.ts";
import { json2csv } from "json-2-csv";

export const PomodoroHistory = () => {
  const isAuth = useAuthStore((state) => state.auth);
  const { data: historyData } = useGetAllHistory();

  const Base = ({ children }: PropsWithChildren) => {
    return (
      <div className={styles.container}>
        <h1>history</h1>
        {children}
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

  if (historyData) {
    const handleDownload = () => {
      if (historyData) {
        const csv = json2csv(historyData);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } else {
        alert("unable to download, data was not received");
      }
    };

    return (
      <Base>
        <button
          onClick={handleDownload}
          hidden={historyData.length === 0}
          disabled={historyData.length === 0}
        >
          download csv
        </button>
        <div className={styles.containerWrap}>
          {historyData.map((h) => (
            <PomodoroHistoryRow key={h.id} id={h.id} />
          ))}
        </div>
      </Base>
    );
  }

  return (
    <Base>
      <div>something went wrong</div>
    </Base>
  );
};

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
