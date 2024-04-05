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

export const Task = ({ id }: { id?: string }) => {
  const { data: task, refetch } = useGetTaskById(id);
  // because react query caches values and the same query key is used due to using the created hook, refetching in this component will refetch all values application wide
  const { refetch: refetchAll } = useGetAllTasks();
  const { mutateAsync: updateTask } = useUpdateTaskMutation(id);
  const { mutateAsync: createTask } = useCreateTaskMutation();
  const { mutateAsync: deleteTask } = useDeleteTaskMutation(id);
  const [editing, setEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: ICreateTask = {
      taskName: e.currentTarget.taskName.value,
      description: e.currentTarget.description.value,
    };

    if (!id) {
      console.log("createTask", data);
      await createTask(data);
      await refetchAll();
    }
    if (id && task) {
      const updateValue = { ...data, complete: task.complete };

      await updateTask(updateValue);
      // since this is just being updated, the value for this item just needs to be updated, the id will not change, and that is all that is passed into the component.
      await refetch();
    }
    setEditing(false);
  };

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
        <input
          type="checkbox"
          name="complete"
          checked={task.complete}
          onChange={async (e) => {
            await updateTask({
              taskName: task.taskName,
              description: task.description,
              complete: e.target.checked,
            });
            await refetch();
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

  return (
    <>
      <button onClick={() => setEditing(true)}>create</button>
    </>
  );
};
