import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["'DM Sans'", ...defaultTheme.fontFamily.sans],
                serif: ["'DM Serif Display'", ...defaultTheme.fontFamily.serif],
            },
        },
    },
    plugins: [
        nextui({
            themes: {
                dark: {
                    colors: {
                        primary: {
                            DEFAULT: "#6C96DA",
                        },
                        secondary: {
                            DEFAULT: "#DA7865",
                        },
                    },
                },
            },
        }),
    ],
    darkMode: "class",
} satisfies Config;
