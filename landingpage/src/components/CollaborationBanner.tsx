import React from 'react';
import { FaGithub, FaCode, FaStar } from 'react-icons/fa6';

/**
 * A banner inviting the reader to join us, primarily on GitHub for now.
 */
const CollaborationBanner: React.FC = (): JSX.Element => {
	return (
		// <div className="bg-gray-100 text-gray-800 p-6 rounded-lg shadow-md border border-gray-200 max-w-7xl m-4 self-center w-full">
		<div className="flex w-full bg-gray-100 text-gray-800">
			<div className="mx-auto flex w-full max-w-7xl flex-col px-8 py-6">
				<h2 className="mb-3 text-2xl font-bold text-blue-600">
					{/* TODO: improve the Slogan */}
					Join Our Open Source Community!
				</h2>
				<p className="mb-4 text-lg">
					{/* TODO: Improve the wording. */}
					Help us build the future of PlebNames. Your skills and ideas
					are welcome!
				</p>
				<div className="flex flex-wrap justify-center gap-4">
					<a
						href="https://github.com/MichiSpebach/plebnames"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center rounded-full bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600 hover:text-white hover:drop-shadow-md"
					>
						<FaGithub className="mr-2" />
						View Repository
					</a>
					<a
						href="https://github.com/MichiSpebach/plebnames/issues"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center rounded-full bg-purple-500 px-4 py-2 text-white transition duration-300 hover:bg-purple-600 hover:text-white hover:drop-shadow-md"
					>
						<FaCode className="mr-2" />
						Contribute Code
					</a>
					<a
						href="https://github.com/MichiSpebach/plebnames/stargazers"
						target="_blank"
						rel="noopener noreferrer"
						// TODO: Might adjust hover:bg-yellow-600, as it seems to look -dirty-
						className="flex items-center rounded-full bg-yellow-500 px-4 py-2 text-white transition duration-300 hover:bg-yellow-600 hover:text-white hover:drop-shadow-md"
					>
						<FaStar className="mr-2" />
						Star Project
					</a>
				</div>
			</div>
		</div>
	);
};

export default CollaborationBanner;
