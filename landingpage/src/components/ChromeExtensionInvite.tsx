import { useEffect, useState } from 'react';

/**
 * TODO: Refactor this into some generic BrowserExtension Invite banner, not only for chrome.
 */
export default function ChromeExtensionInvite() {
	const [isChrome, setIsChrome] = useState(false);

	useEffect(() => {
		const isChromeBrowser =
			/Chrome/.test(navigator.userAgent) &&
			/Google Inc/.test(navigator.vendor);
		setIsChrome(isChromeBrowser);
	}, []);

	if (!isChrome) {
		return null;
	}

	return (
		// <div className="fixed top-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-lg shadow-lg">
		// <div className="fixed top-4 left-4 right-4 backdrop-blur bg-black bg-opacity-20 text-white p-4 rounded-lg shadow-lg">
		<div className="fixed top-4 flex w-full justify-center">
			<div className="mx-8 w-full max-w-7xl rounded-lg bg-black bg-opacity-25 p-4 text-white shadow-lg backdrop-blur">
				<div className="flex flex-col items-center justify-between gap-y-2 md:flex-row">
					<div className="flex flex-col items-center gap-y-2 space-x-4 md:flex-row">
						<img
							src="./../../public/icon-chrome-small.png"
							alt="Chrome Icon"
							className="h-10 w-10"
						/>
						<div>
							<h3 className="text-lg font-semibold">
								Install the Chrome Extension so that you can
								open <span>.BTC</span> names
							</h3>
							<p className="text-sm">
								Join the Protocol Revolution
							</p>
						</div>
					</div>
					<a
						href="https://chromewebstore.google.com/detail/btc/ahjmobbhkjlllhcolchbadpjicolpkob"
						target="_blank"
						rel="noopener noreferrer"
						className="transform rounded-md bg-white px-4 py-2 font-bold text-blue-500 shadow-lg transition-transform hover:scale-105 hover:bg-gray-100"
					>
						Add Extension
					</a>
				</div>
			</div>
		</div>
	);
}
