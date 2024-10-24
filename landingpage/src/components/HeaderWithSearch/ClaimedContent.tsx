import React from 'react';
import { PlebNameHistory } from 'plebnames';

const ClaimedContent: React.FC<{
	queryString: string;
	history: PlebNameHistory;
	tipToInscribeWebsite?: boolean;
}> = ({ history, queryString, tipToInscribeWebsite }) => {
	return (
		<>
			<h3 className="mb-2 text-2xl font-bold text-blue-950">
				"{queryString}" is already claimed!
			</h3>

			{tipToInscribeWebsite &&
				<h4 className="mb-2 text-xl">
					But there is <b>no website inscribed</b> to redirect to.
					If you own "{queryString}" <b>inscribe a website</b> like described below at "Inscribe Entries".
				</h4>
			}

			<p className="break-words text-lg">
				<span className="font-bold">Owner: </span>
				<span className="font-mono">{history.getData().owner}</span>
				<br />

				{history.getData().lightningAddress && (
					<>
						<span className="font-bold">Lightning-Address: </span>
						{history.getData().lightningAddress}
						<br />
					</>
				)}
				{history.getData().linkTo && (
					<>
						<span className="font-bold">LinkTo: </span>
						<a
							href={history.getData().linkTo}
							rel="noopener noreferrer"
							className="text text-blue-950 underline"
							title={`Link to ${history.getData().linkTo}`}
						>
							{history.getData().linkTo}
						</a>
						<br />
					</>
				)}
				{history.getData().website && (
					<>
						<span className="font-bold">Website: </span>
						<a
							href={history.getData().website}
							rel="noopener noreferrer"
							className="underline"
							title={`Website link to ${history.getData().website}`}
						>
							{history.getData().website}
						</a>
						<br />
					</>
				)}
				{history.getData().nostr && (
					<>
						<span className="font-bold">Nostr: </span>
						{history.getData().nostr}
					</>
				)}
			</p>
		</>
	);
};

export default ClaimedContent;
