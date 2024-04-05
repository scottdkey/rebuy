import { useGetAllHistory } from "../../hooks/history.hooks.ts";
import styles from "./history.module.css";

export const PomodoroHistory = () => {
  const { data: historyData } = useGetAllHistory();
  return (
    <div className={styles.container}>
      <h1>history</h1>
      <pre>{JSON.stringify(historyData)}</pre>
    </div>
  );
};
