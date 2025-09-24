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
                bg_gray: '#1a202c',
                accent: '#EF6820',
                card: 'rgba(31 41 55 / 0.9)',
                card_bor: 'rgba(55 65 81 / 0.3)',
                white35_4bor: 'rgba(255, 255, 255, 0.35)',
                white60_4txt: 'rgba(255, 255, 255, 0.60)',
                white90_4txt: 'rgba(255, 255, 255, 0.90)',
                orange_4bor: 'rgba(239, 104 , 32 , 0.5)',
                cyan_4txt:'rgba(6, 182 , 212 ,0.9)',
                cyan_4bor:'rgba(6, 182 , 212 ,0.5)',
                cyan:'rgba(6, 182 , 212 ,1)',
                dropdown: 'rgba(31 41 55 /1)',
                gray4bor: '#4b5563',
                white: 'rgba(255, 255, 255)',

            },
        },
    },
    plugins: [],
}