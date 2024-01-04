import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import defaultTheme from "tailwindcss/defaultTheme";
import tailwindOpenType from "tailwindcss-opentype";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["'IBM Plex Sans'", ...defaultTheme.fontFamily.sans],
                serif: ["'IBM Plex Serif'", ...defaultTheme.fontFamily.serif],
                display: [
                    "'Darker Grotesque Variable'",
                    ...defaultTheme.fontFamily.serif,
                ],
                mono: ["'IBM Plex Mono'", ...defaultTheme.fontFamily.mono],
            },
        },
    },
    plugins: [
        nextui({
            themes: {
                dark: {
                    colors: {
                        primary: {
                            50: "#0D121A",
                            100: "#192333",
                            200: "#26354D",
                            300: "#334666",
                            400: "#3F5880",
                            500: "#4C6999",
                            600: "#587BB3",
                            700: "#658CCC",
                            800: "#729EE6",
                            900: "#7EAFFF",
                            DEFAULT: "#6C96DA",
                        },
                        secondary: {
                            DEFAULT: "#DA7865",
                            50: "#25100B",
                            100: "#3F1C15",
                            200: "#59281F",
                            300: "#73362B",
                            400: "#8D4537",
                            500: "#A65545",
                            600: "#C06655",
                            700: "#DA7865",
                            800: "#EC9281",
                            900: "#FFAF9F",
                        },
                    },
                },
            },
        }),
        require("tailwindcss-opentype"),
    ],
    darkMode: "class",
} satisfies Config;
