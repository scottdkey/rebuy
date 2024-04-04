import styles from "./index.module.css";

export const Index = () => {
  return (
    <div className={styles.container}>
      <h1>Pomodoro Demo App</h1>
      <p>Please sign up or sign in before proceeding.</p>
      <p>This pomodoro demo app is locked behind authentication.</p>
      <p>
        Good that it is very simple to sign up or sign in. Just click the link
        in the top right corner
      </p>
    </div>
  );
};
