import { useEffect, useState } from 'react';

export default function ChromeExtensionInvite() {
	const [isChrome, setIsChrome] = useState(false);

	useEffect(() => {
		// Check if the browser is Chrome
		const isChromeBrowser =
			/Chrome/.test(navigator.userAgent) &&
			/Google Inc/.test(navigator.vendor);
		setIsChrome(isChromeBrowser);
	}, []);

	if (!isChrome) {
		return null; // Don't show the banner if it's not Chrome
	}

	return (
		// <div className="fixed top-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-lg shadow-lg">
		// <div className="fixed top-4 left-4 right-4 backdrop-blur bg-black bg-opacity-20 text-white p-4 rounded-lg shadow-lg">
		<div className="fixed top-4 flex w-full justify-center">
			<div className="max-w-7xl mx-8 w-full backdrop-blur bg-black bg-opacity-25 text-white p-4 rounded-lg shadow-lg">
				<div className="flex items-center justify-between flex-col md:flex-row gap-y-2">
					<div className="flex items-center space-x-4 flex-col md:flex-row gap-y-2">
						<img
							src="./../../public/icon-chrome-small.png"
							alt="Chrome Icon"
							className="w-10 h-10"
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
						className="bg-white text-blue-500 font-bold px-4 py-2 rounded-md shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
					>
						Add Extension
					</a>
				</div>
			</div>
		</div>
	);
}
