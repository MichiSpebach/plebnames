import React from 'react';
import { FaGithub, FaCode, FaStar } from 'react-icons/fa6';
import { MAIN_REPO_LINK } from '../constants/links';

/**
 * A banner inviting the reader to join us, primarily on GitHub for now.
 */
const CollaborationBanner: React.FC = (): JSX.Element => {
	return (
		// <div className="bg-gray-100 text-gray-800 p-6 rounded-lg shadow-md border border-gray-200 max-w-7xl m-4 self-center w-full">
		// <div className="flex w-full bg-gray-100 text-gray-800">
		<div className="flex w-full bg-gradient-to-b from-gray-200 to-white text-gray-800">
			<div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-6 sm:px-6 lg:px-8">
				<h2 className="mb-3 text-3xl font-bold">
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
						href={MAIN_REPO_LINK}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center rounded-full bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600 hover:text-white hover:shadow-md"
					>
						<FaGithub className="mr-2" />
						View Repository
					</a>
					<a
						href={MAIN_REPO_LINK + '/issues'}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center rounded-full bg-purple-500 px-4 py-2 text-white transition duration-300 hover:bg-purple-600 hover:text-white hover:shadow-md"
					>
						<FaCode className="mr-2" />
						Contribute Code
					</a>
					<a
						href={MAIN_REPO_LINK + '/stargazers'}
						target="_blank"
						rel="noopener noreferrer"
						// TODO: Might adjust hover:bg-yellow-600, as it seems to look -dirty-
						className="flex items-center rounded-full bg-yellow-500 px-4 py-2 text-white transition duration-300 hover:bg-yellow-600 hover:text-white hover:shadow-md"
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
