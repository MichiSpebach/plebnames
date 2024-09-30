// import { UAParser } from 'my-ua-parser';
import { UAParser } from 'ua-parser-js';
import { CHROME_WEB_STORE_LINK } from '../constants/links';
import { UAParserNameTypes } from '../utils/UAParserTypes';
// import { FaBrave } from 'react-icons/fa6';

/** Button that links to the Extension download. */
const AddExtension: React.FC<{
	link: string;
}> = ({ link }) => (
	<a
		href={link}
		target="_blank"
		rel="noopener noreferrer"
		// className="transform rounded-md bg-white px-4 py-2 font-bold text-blue-500 shadow-lg transition-transform hover:scale-105 hover:bg-gray-100"
		className="inline-flex transform rounded-md bg-white px-4 py-2 font-bold text-blue-500 shadow-sm transition-all duration-300 hover:-translate-y-px hover:transform hover:bg-gray-100 hover:shadow-xl"
	>
		Add Extension
	</a>
);

type IconType =
	| { type: 'custom'; element: React.ReactNode }
	| { type: 'image'; src: string };

const BrowserBannerView: React.FC<{
	name: string;
	icon: IconType;
	addExtensionLink: string;
	// slogan?: string; // Later?
}> = ({ addExtensionLink, icon, name }) => (
	// <div className="fixed top-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-lg shadow-lg">
	// <div className="fixed top-4 left-4 right-4 backdrop-blur bg-black bg-opacity-20 text-white p-4 rounded-lg shadow-lg">
	<div
		id="addBrowserExtensionBanner"
		className="fixed top-4 z-20 flex w-full justify-center"
	>
		<div className="mx-8 w-full max-w-7xl rounded-lg bg-blue-950 bg-opacity-45 p-4 text-white shadow-lg backdrop-blur">
			<div className="flex flex-col items-center justify-between gap-y-2 md:flex-row">
				<div className="flex flex-col items-center gap-y-2 space-x-4 md:flex-row">
					{icon.type === 'image' && (
						<img
							src={icon.src}
							alt={`${name} Icon`}
							className="h-10 w-10 object-contain object-center"
						/>
					)}
					{icon.type === 'custom' && icon.element}

					<div>
						<h3 className="text-lg font-semibold">
							Install the {name} Extension so that you can open{' '}
							<span>.BTC</span> names
						</h3>
						<p className="text-sm">Join the Protocol Revolution</p>
					</div>
				</div>

				<AddExtension link={addExtensionLink} />
			</div>
		</div>
	</div>
);

/**
 * TODO: hide banner if Extension is installed.
 * TODO: Add `native-like` Google chrome WebStore install function
 *
 * NOTE: Chromium is detected as standard Google Chrome.
 * Detection is possible with some additional techniques, as demonstrated on the demo page by `ua-parser-js`.
 * However, for some reason, the npm-package doesn't seem to differentiate between them.
 */
export default function BrowserExtensionBanner() {
	const ua = new UAParser();
	const os = ua.getOS().name as UAParserNameTypes.OSNameType | undefined;
	const browser = ua.getBrowser().name as
		| UAParserNameTypes.BrowserNameType
		| undefined;

	const isMobile =
		os === 'Android' ||
		os === 'Android-x86' ||
		os === 'HarmonyOS' ||
		os === 'Windows Mobile' ||
		os === 'iOS' ||
		os === 'Windows Phone' ||
		os === 'watchOS' ||
		os === 'BlackBerry';

	if (browser === 'Chrome') {
		if (isMobile) return null;
		return (
			<BrowserBannerView
				name="Chrome"
				icon={{
					type: 'image',
					// TODO: Better Typing possible?
					src: './../../public/browser-icons/google-chrome-icon.png',
				}}
				addExtensionLink={CHROME_WEB_STORE_LINK}
			/>
		);
	} else if (browser === 'Chromium') {
		if (isMobile) return null;
		return (
			<BrowserBannerView
				name="Chromium"
				icon={{
					type: 'image',
					src: './../../public/browser-icons/chromium-icon.png',
				}}
				addExtensionLink={CHROME_WEB_STORE_LINK}
			/>
		);
	} else if (browser === 'Brave') {
		if (isMobile) return null;
		return (
			<BrowserBannerView
				name="Brave"
				icon={{
					type: 'image',
					src: './../../public/browser-icons/brave-icon.png',
				}}
				// icon={{
				// type: 'custom',
				// 	element: <FaBrave className="text-4xl" />,
				// }}
				addExtensionLink={CHROME_WEB_STORE_LINK}
			/>
		);
	} else if (browser === 'Firefox') {
	} else if (browser === 'Edge') {
	} else if (
		browser === 'Opera' ||
		browser === 'Opera GX' ||
		browser === 'Opera Coast' ||
		browser === 'Opera Mini'
	) {
	} else if (browser === 'Safari') {
	} else if (browser === 'Safari Mobile') {
	}

	return null;
}
