/**
 * What kind of Integrations?
 * - Browser Extensions
 *		- Chrome & Chromium (chromium-extension)
 *		- Brave (chromium-extension)
 *		- Opera (chromium-extension)
 *		- Firefox
 * 		- Safari (not sure if possible)
 * - Social Extensions (Primarily Nostr.)
 * 		- Primal Nostr Client
 * - Payment Extensions (primarily Wallets)
 * - Other Applications
 */
import React from 'react';
// import { FaChrome, FaFirefox, Brave, FaOpera, FaSafari } from 'react-icons/fa';
import {
	FaChrome,
	FaFirefox,
	FaBrave,
	FaOpera,
	FaSafari,
	FaGithub,
	// FaWallet,
	// FaBolt, // different bolt icon, as normal `fa`
} from 'react-icons/fa6';
import { FaBolt } from 'react-icons/fa';
import { BsWallet2 } from 'react-icons/bs';
import { HiOutlineDesktopComputer } from 'react-icons/hi';

type ButtonType = {
	link: string;
	/** Mainly text, but a span with an icon is also possible */
	label: React.ReactNode;
};

interface Extension {
	name: string;
	description: string;
	icon: React.ReactNode;
	/** Categorizing by type could be useful later. */
	category: 'browser' | 'social' | 'payment' | 'other';
	primaryLink?: ButtonType;
	secondaryLink?: ButtonType;
}

const GitHubRepoLabel = (
	<>
		<FaGithub className="mr-1" />
		Github Repo
	</>
);

const GitHubIssueLabel = (
	<>
		<FaGithub className="mr-1" />
		Github Issue
	</>
);

const extensions: Extension[] = [
	{
		name: 'Chrome Extension',
		description: 'PlebNames for Chrome and Chromium-based browsers',
		icon: <FaChrome className="text-4xl" />,
		category: 'browser',
		primaryLink: {
			label: 'Add Extension',
			link: 'https://chromewebstore.google.com/detail/btc/ahjmobbhkjlllhcolchbadpjicolpkob',
		},
		secondaryLink: {
			label: GitHubRepoLabel,
			link: 'https://github.com/MichiSpebach/plebnames',
		},
	},
	{
		name: 'Brave Extension',
		description: 'PlebNames for Brave browser',
		icon: <FaBrave className="text-4xl" />,
		category: 'browser',
		primaryLink: {
			label: 'Add Extension',
			link: 'https://chromewebstore.google.com/detail/btc/ahjmobbhkjlllhcolchbadpjicolpkob',
		},
		secondaryLink: {
			label: GitHubRepoLabel,
			link: 'https://github.com/MichiSpebach/plebnames',
		},
	},
	{
		name: 'Opera Extension',
		description: 'PlebNames for Opera browser. Coming Soon!',
		icon: <FaOpera className="text-4xl" />,
		category: 'browser',
		secondaryLink: {
			label: GitHubRepoLabel,
			link: 'https://github.com/MichiSpebach/plebnames',
		},
	},
	{
		name: 'Firefox Extension',
		description: 'PlebNames for Firefox',
		icon: <FaFirefox className="text-4xl" />,
		category: 'browser',
		// primaryLink: {
		// 	label: 'Stuff',
		// 	link: '#',
		// },
		secondaryLink: {
			label: GitHubIssueLabel,
			link: 'https://github.com/MichiSpebach/plebnames/issues/1',
		},
	},
	{
		name: 'Snort Nostr Client',
		description: 'PlebNames integration for Snort Nostr Client. In Review!',
		icon: <FaBolt className="text-4xl" />,
		category: 'social',
		secondaryLink: {
			label: GitHubIssueLabel,
			link: 'https://github.com/v0l/snort/issues/586',
		},
	},
	// {
	// 	name: 'Primal Nostr Client',
	// 	description:
	// 		'PlebNames integration for Primal Nostr Client.',
	// 	icon: <FaBolt className="text-4xl" />,
	// 	category: 'social',
	// 	primaryLink: {
	// 		label: 'GitHub Issue',
	// 		link: '#',
	// 	},
	// },
	// {
	//     name: "Safari Extension",
	//     description: "PlebNames for Safari (coming soon)",
	//     icon: <FaSafari className="text-4xl" />,
	//     category: "browser",
	// },
	{
		name: 'Wallet Integration',
		description: 'PlebNames for Bitcoin wallets. Stay Tuned!',
		icon: <BsWallet2 className="text-4xl" />,
		category: 'payment',
	},
	{
		name: 'Other Applications',
		description: 'PlebNames for various other applications',
		icon: <HiOutlineDesktopComputer className="text-4xl" />,
		category: 'other',
	},
] as const;

const ExtensionTile: React.FC<Extension> = ({
	name,
	description,
	icon,
	category,
	primaryLink,
	secondaryLink,
}) => {
	return (
		<div
			className="flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-shadow duration-300 hover:border-blue-500 hover:shadow-lg"
			onClick={
				primaryLink?.link
					? () => window.open(primaryLink.link, '_blank')
					: undefined
			}
		>
			<div className="flex items-center">
				{icon}
				<h3 className="ml-4 text-xl font-semibold text-gray-800">
					{name}
				</h3>
			</div>

			<p className="mb-6 mt-4 text-gray-600">{description}</p>

			<div className="mt-auto flex items-center justify-between">
				{primaryLink?.link && (
					<a
						href={primaryLink?.link || undefined}
						className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white transition duration-300 hover:bg-blue-600 hover:text-white hover:shadow-lg"
						onClick={(e) => e.stopPropagation()}
						rel="noopener noreferrer"
					>
						{primaryLink.label}
					</a>
				)}

				{secondaryLink && (
					<a
						href={secondaryLink.link}
						className="flex items-center text-gray-600 hover:text-blue-500"
						target="_blank"
						rel="noopener noreferrer"
						onClick={(e) => e.stopPropagation()}
					>
						{secondaryLink.label}
					</a>
				)}
			</div>
		</div>
	);
};

function ExtensionsGallery() {
	return (
		<div className="bg-gradient-to-b from-white to-gray-100 py-12">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h2 className="mb-8 text-3xl font-extrabold text-gray-900">
					Extensions Gallery
				</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{extensions.map((extension, index) => (
						<ExtensionTile key={index} {...extension} />
					))}
				</div>
			</div>
		</div>
	);
}

export default ExtensionsGallery;
