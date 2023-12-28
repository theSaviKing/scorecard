import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App.tsx";
import "./index.css";
import "@fontsource-variable/dm-sans/wght-italic.css";
import "@fontsource/dm-serif-display";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <NextUIProvider>
            <App />
        </NextUIProvider>
    </React.StrictMode>
);
