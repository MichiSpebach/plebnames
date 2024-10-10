import { FaBolt, FaGithub } from 'react-icons/fa';
import { MAIN_REPO_LINK } from '../constants/links';

/**
 * Renders the footer component for the entire web page.
 * This footer contains important links such as the GitHub repository and later other external resources.
 *
 * @component
 * @returns {JSX.Element} The footer element for the webpage.
 */
function Footer() {
	return (
		<footer className="relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 opacity-95"></div>
			<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjIyIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-10"></div>
			<div className="absolute inset-0 backdrop-blur-sm"></div>
			{/* <div className="absolute inset-0 bg-gradient-to-t from-blue-800/20 to-transparent"></div> */}
			<div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

			{/* Different idea <div className="container mx-auto px-4 relative z-10 bg-red-400"> */}
			<div className="relative z-10 flex w-full">
				<div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
					<div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
						<a
							target="_blank"
							href={MAIN_REPO_LINK}
							rel="noopener noreferrer"
							className="link-underline inline-flex items-center space-x-2 text-white transition-colors duration-200 ease-in-out hover:text-blue-200"
						>
							<FaGithub className="text-2xl" />
							<span className="text-lg font-semibold">
								GitHub Repository
							</span>
						</a>
						<a className="link-underline inline-flex items-center space-x-2 text-white transition-colors duration-200 ease-in-out hover:text-blue-200">
							<FaBolt className="text-2xl" />
							<span className="text-lg font-semibold">
								Nostr (coming soon)
							</span>
						</a>
					</div>

					<div className="text-center text-white md:text-right">
						<p className="text-base md:text-sm">
							In Bitcoin We Etch, In Freedom We Trust.
						</p>
						<p className="mt-1 text-base text-gray-300 md:text-xs">
							Empowering the plebs with Bitcoin-native naming.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
