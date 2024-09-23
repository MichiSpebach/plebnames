import { FaSquareGithub } from 'react-icons/fa6';
import { IoShareSocialSharp } from 'react-icons/io5';

/**
 * Renders the footer component for the entire web page.
 * This footer contains important links such as the GitHub repository and later other external resources.
 *
 * @component
 * @returns {JSX.Element} The footer element for the webpage.
 */
function Footer() {
	return (
		// <footer className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6">
		<footer className="bg-gradient-to-r from-blue-950 to-black text-white py-6">
			<div className="container mx-auto flex justify-center gap-x-6 gap-y-3 flex-wrap">
				<a
					target="_blank"
					href="http://github.com/MichiSpebach/plebnames"
					rel="noopener noreferrer"
					className="inline-flex items-center space-x-2 text-white transition-colors duration-200 ease-in-out hover:text-indigo-200 link-underline"
				>
					<FaSquareGithub className="text-2xl" />
					<span className="text-lg font-semibold">
						GitHub Repository
					</span>
				</a>
				<a
					// target="_blank"
					// href=""
					// rel="noopener noreferrer"
					className="inline-flex items-center space-x-2 text-white transition-colors duration-200 ease-in-out hover:text-indigo-200 link-underline"
				>
					{/* <FaGlobe className="text-2xl" /> */}
					<IoShareSocialSharp className="text-2xl" />
					<span className="text-lg font-semibold">
						Nostr (coming soon)
					</span>
				</a>
			</div>
		</footer>
	);
}

export default Footer;
