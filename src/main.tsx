import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App.tsx";
import Board from "./Board.tsx";
import "./assets/style.ts";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/board",
        element: <Board />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <NextUIProvider>
            <RouterProvider router={router} />
        </NextUIProvider>
    </React.StrictMode>
);
