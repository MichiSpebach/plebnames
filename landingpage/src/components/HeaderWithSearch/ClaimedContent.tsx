import React from 'react';
import { PlebNameData, PlebNameHistory, util } from 'plebnames';
import CopyButton from '../CopyButton';
import LinkWithCopyButton from '../LinkWithCopyButton';

const ClaimedContent: React.FC<{
	queryString: string;
	history: PlebNameHistory;
	tipToInscribeWebsite?: boolean;
}> = ({ history, queryString, tipToInscribeWebsite }) => {
	const data: PlebNameData = history.getData()
	return (
		<>
			<h3 className="mb-2 text-2xl font-bold text-blue-950">
				"{queryString}" is already claimed!
			</h3>

			{tipToInscribeWebsite &&
				<h4 className="mb-2 text-xl">
					But there is <b>no website inscribed</b> to redirect to.
					If you own "{queryString}" <b>inscribe a website</b> like described below at "Add or modify inscriptions".
				</h4>
			}

			<p className="break-words text-lg">
				<span className="font-bold">Owner: </span>
				<LinkWithCopyButton
					text={data.owner}
					link={`https://mempool.space/address/${util.generateBech32AddressWithPad(util.normalizeAsciiToBech32(history.name))}`}
					additionalClassName='font-mono'
				/>
				<br />

				{data.lightningAddress && (
					<>
						<span className="font-bold">Lightning-Address: </span>
						{data.lightningAddress}
						<CopyButton text={data.lightningAddress}/>
						<br />
					</>
				)}
				{data.linkTo && (
					<>
						<span className="font-bold">LinkTo: </span>
						<LinkWithCopyButton text={data.linkTo} link={data.linkTo} />
						<br />
					</>
				)}
				{data.website && (
					<>
						<span className="font-bold">Website: </span>
						<LinkWithCopyButton text={data.website} link={toExternalLink(data.website)} />
						<br />
					</>
				)}
				{data.nostr && (
					<>
						<span className="font-bold">Nostr: </span>
						<LinkWithCopyButton text={data.nostr} link={`https://njump.me/${data.nostr}`} />
					</>
				)}
			</p>
		</>
	);
};

function toExternalLink(website: string): string {
	if (website.includes('//')) {
		return website
	}
	return '//'+website
}

export default ClaimedContent;
