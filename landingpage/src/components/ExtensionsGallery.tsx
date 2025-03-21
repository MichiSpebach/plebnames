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
import { FaBolt } from 'react-icons/fa';
import {
	FaBrave,
	FaChrome,
	FaFirefox,
	FaGithub,
	FaOpera,
	FaSafari,
} from 'react-icons/fa6';
import { HiComputerDesktop } from 'react-icons/hi2';

// import { IoIosWallet } from 'react-icons/io';
// import { HiMiniWallet } from 'react-icons/hi2';
import { GiMagicPortal } from 'react-icons/gi';
import { IoWallet } from 'react-icons/io5';
import {
	BRAVE_EXTENSION_LINK,
	CHROME_WEB_STORE_LINK,
	MAIN_REPO_LINK,
} from '../constants/links';

type ButtonType = {
	link: string;
	/** Mainly text, but a span with an icon is also possible */
	label: React.ReactNode;
};

interface Extension {
	name: string;
	description: React.ReactNode;
	/** Mainly text, but html styling tags are are possible */
	icon: React.ReactNode;
	/** Categorizing by type could be useful later. */
	category: 'browser' | 'social' | 'payment' | 'other';
	primaryLink?: ButtonType;
	secondaryLink?: ButtonType;
}

const GitHubRepoLabel = (
	<>
		<FaGithub className="mr-1" />
		GitHub Repo
	</>
);

const GitHubIssueLabel = (
	<>
		<FaGithub className="mr-1" />
		GitHub Issue
	</>
);

const extensions: Extension[] = [
	{
		name: 'Pleb.Name Portal',
		description: (
			<>
				Provides NIP-05 verification and classic DNS access to PlebNames (e.g., satoshi.pleb.name), including link forwarding.
			</>
		),
		icon: <GiMagicPortal className="text-4xl" />,
		category: 'other',
		primaryLink: {
			label: 'Visit Portal',
			link: 'https://pleb.name',
		},
	},
	{
		name: 'Chrome Extension',
		description: 'PlebNames for Chrome and Chromium-based browsers',
		icon: <FaChrome className="text-4xl" />,
		category: 'browser',
		primaryLink: {
			label: 'Add Extension',
			link: CHROME_WEB_STORE_LINK,
		},
		secondaryLink: {
			label: GitHubRepoLabel,
			link: MAIN_REPO_LINK,
		},
	},
	{
		name: 'Brave Extension',
		description: 'PlebNames for Brave browser',
		icon: <FaBrave className="text-4xl" />,
		category: 'browser',
		primaryLink: {
			label: 'Add Extension',
			link: BRAVE_EXTENSION_LINK,
		},
		secondaryLink: {
			label: GitHubRepoLabel,
			link: MAIN_REPO_LINK,
		},
	},
	{
		name: 'Opera Extension',
		description: (
			<>
				PlebNames for Opera browser.
				<br />
				<b>Coming Soon!</b>
			</>
		),
		icon: <FaOpera className="text-4xl" />,
		category: 'browser',
		secondaryLink: {
			label: GitHubIssueLabel,
			link: 'https://github.com/MichiSpebach/plebnames/issues/8',
		},
	},
	{
		name: 'Microsoft Edge Extension',
		description: 'PlebNames for Microsoft Edge. Coming Soon!',
		icon: <FaOpera className="text-4xl" />,
		category: 'browser',
		secondaryLink: {
			label: GitHubIssueLabel,
			link: 'https://github.com/MichiSpebach/plebnames/issues/9',
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
		name: 'Safari Extension',
		description: 'PlebNames for Safari.',
		icon: <FaSafari className="text-4xl" />,
		category: 'browser',
		secondaryLink: {
			label: GitHubIssueLabel,
			link: 'https://github.com/MichiSpebach/plebnames/issues/2',
		},
	},
	{
		name: 'Snort Nostr Client',
		// description: 'PlebNames integration for Snort Nostr Client. In Review!',
		description: (
			<>
				PlebNames integration for Snort Nostr Client.
				<br />
				<b>In Review!</b>
			</>
		),
		icon: <FaBolt className="text-4xl" />,
		category: 'social',
		secondaryLink: {
			label: GitHubIssueLabel,
			link: 'https://github.com/v0l/snort/issues/586',
		},
	},
	{
		name: 'Primal Nostr Clients',
		description:
			'PlebNames integration for all Primal Nostr Clients. Work in progress.',
		icon: <FaBolt className="text-4xl" />,
		category: 'social',
		secondaryLink: {
			label: GitHubIssueLabel,
			link: 'https://github.com/PrimalHQ/primal-web-app/issues/95',
		},
	},
	{
		name: 'Wallet Integration',
		description: 'PlebNames for Bitcoin wallets. Stay Tuned!',
		// IoIosWallet; // Cool smooth
		// HiMiniWallet; // Also smooth
		// IoWallet; // Smooth but realistic
		icon: <IoWallet className="text-4xl" />,
		category: 'payment',
	},
	{
		name: 'Other Applications',
		description: 'PlebNames for various other applications',
		icon: <HiComputerDesktop className="text-4xl" />,
		category: 'other',
	},
] as const;

const ExtensionTile: React.FC<Extension> = ({
	name,
	description,
	icon,
	// category,
	primaryLink,
	secondaryLink,
}) => {
	let boxClickHandler: React.MouseEventHandler<HTMLDivElement> | undefined;
	if (primaryLink?.link) {
		boxClickHandler = () => window.open(primaryLink.link, '_blank');
	} else if (secondaryLink?.link) {
		boxClickHandler = () => window.open(secondaryLink.link, '_blank');
	}

	return (
		<div
			className="flex cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:transform hover:border-blue-500 hover:shadow-xl"
			onClick={boxClickHandler}
		>
			<div className="mb-4 flex items-center">
				<div className="mr-4 text-blue-500">{icon}</div>
				<h3 className="text-2xl font-bold text-gray-800">{name}</h3>
			</div>

			<p className="mb-6 flex-grow text-gray-600">{description}</p>

			<div className="mt-auto flex flex-wrap justify-between gap-x-3 gap-y-4">
				{primaryLink?.link && (
					<a
						href={primaryLink?.link || undefined}
						className="rounded-full bg-blue-500 px-6 py-2 font-semibold text-white transition duration-300 hover:bg-blue-600 hover:text-white hover:shadow-lg"
						onClick={(e) => e.stopPropagation()}
						rel="noopener noreferrer"
					>
						{primaryLink.label}
					</a>
				)}

				{secondaryLink && (
					<a
						href={secondaryLink.link}
						className="ml-2 flex items-center text-gray-500 transition duration-300 hover:text-blue-500"
						style={{
							/** Visual balancing */
							marginLeft: primaryLink?.link ? '0.4rem' : '0',
						}}
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
		<section
			id="extensionsGallery"
			className="bg-gradient-to-b from-white to-gray-100 py-20"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h2 className="mb-12 text-center text-4xl font-extrabold text-gray-900">
					Explore PlebNames Integrations
				</h2>
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{extensions.map((extension, index) => (
						<ExtensionTile key={index} {...extension} />
					))}
				</div>
			</div>
		</section>
	);
}

export default ExtensionsGallery;
