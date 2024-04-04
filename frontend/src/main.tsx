import React from "react";
import ReactDOM from "react-dom/client";
import { Root } from "./Root.tsx";
//this one isn't a module so the css will cascade through the whole app inheriting default styles
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SignIn } from "./pages/auth/SignIn.tsx";
import { SignUp } from "./pages/auth/SignUp.tsx";
import { Error } from "./pages/Error/error.tsx";
import { Index } from "./pages/index/index.tsx";
import { Timers } from "./pages/timers/timers.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const router = createBrowserRouter([
  {
    //setting this up so it has a shared layout element
    element: <Root />,
    // this is the default error page, nothing fancy
    errorElement: <Error />,
    children: [
      {
        //home page mostly for effect
        path: "/",
        element: <Index />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        //this is the location of the pomodoro timers and settings
        path: "/timers",
        element: <Timers />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
