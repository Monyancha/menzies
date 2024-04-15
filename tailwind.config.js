/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "425px",
        lg_default: "1000px",
        lg: "1030px",
        "3xl": "1920px",
        "4xl": "3840px",
      },
      height: {
        /* https://stackoverflow.com/a/76120728 */
        screen: ["100vh /* fallback for Opera, IE and etc. */", "100dvh"],
      },
      zIndex: {
        100: "100",
      },
      colors: {
        primary: "#17ab30",
        primaryDarker: "#17ab30",

        light: "#F7F9FC",
        lighter: "#fbfcfe",
        darkest: "#233044",
        dark: "#364B6A",
        darkish: "#3e567b",
        info: "#e5f6fd",
        error: "#C62828",
        success: "#1B5E20",
        successLighter: "#47ff6f",
        warning: "#00bcc8",
        grey: {
          50: "#C0C0C0",
          100: "#7D7B7B",
        },
        purple: "#9D6381",
        orange: "#00bcc8",
        green: "#314648",
        client: {
          light: "#EDECEC",
        },
      },
    },
  },
  plugins: [],
}