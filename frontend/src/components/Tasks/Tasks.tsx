import { PropsWithChildren } from "react";
import { useGetAllTasks } from "../../hooks/task.hooks.ts";
import styles from "./Tasks.module.css";
import { Task } from "./Task.tsx";

export const Tasks = () => {
  const { data: tasks } = useGetAllTasks();

  const Base = ({ children }: PropsWithChildren) => {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>tasks</h3>
        {children}
        <Task />
      </div>
    );
  };

  if (tasks) {
    return (
      <Base>
        {tasks.map((task) => (
          <Task key={task.id} id={task.id} />
        ))}
      </Base>
    );
  }
  return (
    <Base>
      <p>something went wrong</p>
    </Base>
  );
};
