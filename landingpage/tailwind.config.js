/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				// From https://brandpalettes.com/bitcoin-colors/
				bitcoin: {
					orange: '#F7931A',
					dark: '#4D4D4E',
					gray: '#828282',
					lightGray: '#F2F2F2',
					white: '#FFFFFF',
				},
			},
		},
	},
	plugins: [],
};
