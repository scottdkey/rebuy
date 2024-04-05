import { AxiosError } from "axios";

// this would be handled with a toast in a real app, and that might be connected to a hook, here we're just sending to the browser alert for simplicity
/**
 * Handle onError from TanStack query mutations
 * @param err AxiosError Type
 */
export const HandleAxiosError = (err: AxiosError<Message>) => {
  alert(JSON.stringify(err.response?.data.message, null, 2) || err.message);

}