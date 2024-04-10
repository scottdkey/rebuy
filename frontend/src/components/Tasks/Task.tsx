import { useState } from "react";
import {
  useGetTaskById,
  useGetAllTasks,
  useUpdateTaskMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
} from "../../hooks/task.hooks.ts";
import { Tooltip } from "react-tooltip";
import styles from "./Tasks.module.css";
import {
  useGetHistoryById,
  useUpdateHistoryMutation,
} from "../../hooks/history.hooks.ts";
import { useHistoryStore } from "../../stores/history.store.ts";
import { usePomodoroStore } from "../../stores/pomoodoro.store.ts";

export const Task = ({ id }: { id?: string }) => {
  const { data: task, refetch } = useGetTaskById(id);
  // because react query caches values and the same query key is used due to using the created hook, refetching in this component will refetch all values application wide
  const { refetch: refetchAll } = useGetAllTasks();
  const { mutateAsync: updateTask } = useUpdateTaskMutation(id);
  const { mutateAsync: createTask } = useCreateTaskMutation();
  const { mutateAsync: deleteTask } = useDeleteTaskMutation(id);
  // setHistoryId is not needed in this context, just the saved value
  const historyId = useHistoryStore((s) => s.historyId);
  const { data: history, refetch: refetchHistory } =
    useGetHistoryById(historyId);
  const { mutateAsync: updateHistory } = useUpdateHistoryMutation(historyId);
  const [editing, setEditing] = useState(false);
  const running = usePomodoroStore((state) => state.running);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: ICreateTask = {
      taskName: e.currentTarget.taskName.value,
      description: e.currentTarget.description.value,
    };

    if (!id) {
      await createTask(data);
      await refetchAll();
    }
    if (id && task) {
      const updateValue = { ...data, complete: task.complete };

      await updateTask(updateValue);
      // since this is just being updated, the value for this item just needs to be updated, the id will not change, and that is all that is passed into the component.
      await refetch();
      await refetchAll();
    }
    setEditing(false);
  };

  // in this component I've opted not to use all handlers(there is still a submitHandler)
  // the reason being is that the logic is much simpler than the CountdownTimer.tsx
  // it is much easier to visually parse what is happening without that extra overhead
  if (editing) {
    return (
      <>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="taskName">name</label>
          <input
            className={styles.input}
            name="taskName"
            required
            defaultValue={task ? task.taskName : ""}
          />
          <label htmlFor="description">description</label>
          <textarea
            className={styles.input}
            name="description"
            required
            defaultValue={task ? task.description : ""}
          />
          <button type="submit">save</button>
        </form>
      </>
    );
  }

  if (task) {
    return (
      <div className={styles.TaskContainer}>
        {task.complete === false && running === false ? (
          <Tooltip
            id={`task-checkbox-${task.id}`}
            className={styles.tooltip}
            anchorSelect={`.task-checkbox-${task.id}`}
          >
            Unable to complete when timer isn't running
          </Tooltip>
        ) : null}
        <input
          type="checkbox"
          name="complete"
          disabled={!running}
          className={`task-checkbox-${task.id} ${styles.checkbox}`}
          checked={task.complete}
          onChange={async (e) => {
            const value = e.target.checked;
            await updateTask({
              taskName: task.taskName,
              description: task.description,
              complete: value,
            });
            await refetch();
            await refetchAll();
            // ensure history is defined and the current session hasn't ended
            if (history && history.endTime === null) {
              let completedTasks = history.completedTasks;
              if (value === true) {
                completedTasks.push({
                  id: task.id,
                  taskName: task.taskName,
                  description: task.description,
                });
              }
              if (value === false) {
                completedTasks = completedTasks.filter(
                  (ct) => ct.id !== task.id
                );
              }

              await updateHistory({
                completedTasks,
                pauses: history.pauses,
                endTime: history.endTime,
              });
              refetchHistory();
            }
          }}
        />
        <h3 className={`${styles.TaskName} task-${task.id}`}>
          {task.taskName}
        </h3>
        <Tooltip
          id={`task-${task.id}`}
          className={styles.tooltip}
          anchorSelect={`.task-${task.id}`}
        >
          {task.description}
        </Tooltip>

        <button className={styles.EditButton} onClick={() => setEditing(true)}>
          edit
        </button>
        <button
          className={styles.EditButton}
          onClick={async () => {
            await deleteTask();
            await refetchAll();
          }}
        >
          delete
        </button>
      </div>
    );
  }

  if (!id) {
    return (
      <>
        <button onClick={() => setEditing(true)}>create</button>
      </>
    );
  }
  return <>something went wrong</>;
};
