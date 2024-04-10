import { useSignUpMutation } from "../../hooks/user.hooks.ts";
import styles from "./Auth.module.css";
import z from "zod";

export const SignUp = () => {
  const { mutateAsync } = useSignUpMutation();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = z
      .object({
        username: z.string(),
        password: z.string(),
        email: z.string().email(),
      })
      .parse({
        username: event.currentTarget.username.value,
        password: event.currentTarget.password.value,
        email: event.currentTarget.email.value,
      });

    await mutateAsync(data);
  };
  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <label htmlFor="username">username</label>
      <input name="username" className={styles.formInput} />
      <label htmlFor="password">password</label>
      <input type="password" className={styles.formInput} name="password" />
      <label htmlFor="email">email</label>
      <input type="email" className={styles.formInput} name="email" />
      <button className={styles.submitButton} type="submit">
        Submit
      </button>
    </form>
  );
};
