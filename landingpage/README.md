# React + TypeScript + Vite

## Some Random Notes

-   [ ] Place this spacing everywhere `px-4 sm:px-6 lg:px-8`
-   [x] BrowserExtension UA-Library einbinden und logic
    -   [x] soll sicherstellen, das Andi-GraphenOS nicht passiert
-   [ ] Link weiterleitung, wie bei legacy implementation. Über Web-Search-URL Params stellen wir das sicher. (Domain Input in URL State)
-   [x] You can claim nur für non-custodial banner
-   [ ] by you want claim, die Adresse erklären. (Bech32 Adresse)
    -   bc1q + `pleb` + `Wiederholung` + `overflow-ende` + checksum
    -   More/Learn more sign

---

-   [ ] Mobile Friendly
    -   [ ] Alter tool input bar
-   [x] Refactor browser Invite
-   [ ] Browser Invite native chrome function
-   [ ] Fix Chrome extension protocol-needed-search-engine bug
    -   [x] Research and understand
    -   [ ] Fix
-   [x] Invite Extensions Banner mehr Komponente-siren

    -   [x] Mega Component welche alle Plattformen prüft
    -   [ ] Evtl. ein Banner falls man schon extension installed hat.

-   [ ] Displaying Expert Info (owner, history/timeline)
-   [ ] Refining search UI
-   [ ] Pros/Cons
-   [ ] Writing down more slogans and grammar correct them with LLM (So that we can do like a list or some banner which displays them randomly)

-   [ ] Meme Section
-   [ ] EmotionCSS

-   [x] Name Tooling (E.g. generating tx-templates)
-   [x] Extension and AddOns Section, where they get explained
-   [x] github-collab-banner
-   [x] Adding the two Footer Slogan
-   [x] Tailwind
-   [x] Icons
-   [x] Design planen
-   [x] Body Padding und so anpassen, das wieder hier alles passt.
-   [x] Search-Input Component

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

-   Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
	languageOptions: {
		// other options...
		parserOptions: {
			project: ['./tsconfig.node.json', './tsconfig.app.json'],
			tsconfigRootDir: import.meta.dirname,
		},
	},
});
```

-   Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
-   Optionally add `...tseslint.configs.stylisticTypeChecked`
-   Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
	// Set the react version
	settings: { react: { version: '18.3' } },
	plugins: {
		// Add the react plugin
		react,
	},
	rules: {
		// other rules...
		// Enable its recommended rules
		...react.configs.recommended.rules,
		...react.configs['jsx-runtime'].rules,
	},
});
```
