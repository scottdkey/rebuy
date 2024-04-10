import styles from "./Auth.module.css";
import { useSignInMutation } from "../../hooks/auth.hooks.ts";
import { z } from "zod";

export const SignIn = () => {
  const { mutateAsync } = useSignInMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const data: ISignInUser = z
        .object({
          username: z.string(),
          password: z.string(),
        })
        .parse({
          username: event.currentTarget.username.value,
          password: event.currentTarget.password.value,
        });

      await mutateAsync(data);
    } catch (e: any) {
      console.error(
        "unable to validate handleSubmit payload something went wrong"
      );
    }
  };
  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <label htmlFor="username">username</label>
      <input name="username" className={styles.formInput} required />
      <label htmlFor="password">password</label>
      <input
        type="password"
        className={styles.formInput}
        name="password"
        required
      />
      <button className={styles.submitButton} type="submit">
        Submit
      </button>
    </form>
  );
};
