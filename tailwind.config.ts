import type { Config } from "tailwindcss";

export default {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: "var(--font-roboto)",
      },
      colors: {
        white: "var(--white)",
        black: "var(--black)",
        darkGray: "var(--dark-gray)",
        gray: "var(--gray)",
        lightGray: "var(--light-gray)",
        blue: "var(--blue)",
        lightBlue: "var(--light-blue)",
      },
    },
  },
  plugins: [],
} satisfies Config;
