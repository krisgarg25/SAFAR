/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily:{
                noto :['Roboto']

            },
            colors :{
                bg_gray: '#2D2E2F',
                accent: '#EF6820',
                white35_4bor: 'rgba(255, 255, 255, 0.35)',
                white60_4txt: 'rgba(255, 255, 255, 0.60)',
                white90_4txt: 'rgba(255, 255, 255, 0.90)',
                orange_4bor: 'rgba(239, 104 , 32 , 0.5)',
            },
        },
    },
    plugins: [],
}