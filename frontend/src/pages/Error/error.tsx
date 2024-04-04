import { useNavigate } from "react-router-dom";
import styles from "./error.module.css";

export const Error = () => {
  const nav = useNavigate();
  return (
    <div className={styles.errorContainer}>
      <button
        onClick={() => {
          nav(-1);
        }}
      >
        go back
      </button>
      <p>this is the default error page</p>
    </div>
  );
};
