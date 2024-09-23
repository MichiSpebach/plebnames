import * as plebNames from '@plebnames/core';
import { useState } from 'react';
import { PiSpinnerGapBold } from 'react-icons/pi';
import './App.css';

import ChromeExtensionInvite from './components/ChromeExtensionInvite';
import Footer from './components/Footer';
import SearchInput from './components/SearchInput';

/**
 * The different status's our query can have.
 */
enum statusTypes {
	/** When the User has not done a search. */
	notSearched = 'not-searched',

	/** Loading the data */
	loading = 'loading',

	/** Name is not claimed */
	unclaimed = 'unclaimed',

	/** Name is claimed */
	claimed = 'claimed',
}

type DataTypes =
	| {
			status: statusTypes.claimed;
			history: plebNames.PlebNameHistory;
			query: string;
	  }
	| {
			status: statusTypes.loading;
			query: string;

			// Null Types
			history: null;
	  }
	| {
			status: statusTypes.notSearched;

			// Null Types
			query: null;
			history: null;
	  }
	| {
			status: statusTypes.unclaimed;
			query: string;

			// Null Types
			history: null;
	  };

/**
 * Hook for the plebName Search.
 */
const usePlebNameSearch = () => {
	const [data, setData] = useState<DataTypes>({
		status: statusTypes.notSearched,
		history: null,
		query: null,
	});

	/** Handels Search Input */
	const handleSearch = async (query: string) => {
		if (query.length < 1) {
			setData({
				status: statusTypes.notSearched,
				history: null,
				query: null,
			});
			alert('Please enter a name.');
			return;
		}
		setData({ status: statusTypes.loading, history: null, query });

		console.log('Searching for:', query);

		const history =
			await plebNames.bitcoinExplorer.followNameHistory(query);

		if (history === 'unclaimed') {
			setData({
				status: statusTypes.unclaimed,

				/** No History object. */
				history: null,
				query: query,
			});
		} else {
			setData({
				status: statusTypes.claimed,
				history,
				query,
			});
		}
	};

	return { handleSearch, ...data };
};

function App() {
	const { handleSearch, history, query, status } = usePlebNameSearch();

	return (
		<>
			<section
				id="header"
				className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white transition-all"
			>
				<div className="w-full max-w-7xl mx-auto p-8 overflow-hidden">
					<h1 className="text-5xl md:text-7xl font-bold mb-3">
						PlebNames
					</h1>
					<h2 className="text-3xl md:text-5xl mb-12">
						Piggybacked names on Bitcoin, just Bitcoin!
					</h2>

					<div className="w-full max-w-xs mb-6">
						<SearchInput onSearch={handleSearch} />
					</div>

					{status === statusTypes.loading && (
						<div className="lex w-full flex-col gap-3 backdrop-blur bg-white bg-opacity-15 text-white p-4 rounded-xl shadow-lg">
							<h3 className="font-bold text-2xl animate-pulse">
								Loading data for "{query}" ...
							</h3>
							<PiSpinnerGapBold
								size={34}
								className="animate-spin"
							/>
						</div>
					)}

					{status === statusTypes.unclaimed && (
						<div className="flex w-full flex-col gap-3 backdrop-blur bg-white bg-opacity-15 text-white p-4 rounded-xl shadow-lg">
							<h3 className="font-bold text-2xl mb-2">
								"{query}" is still unclaimed!
							</h3>

							<p className="text-lg break-words">
								You can claim it by sending a minimum amount of
								satoshis (atm 546) to '
								{plebNames.util.generateBech32AddressWithPad(
									plebNames.util.normalizeAsciiToBech32(
										query,
									),
								)}
								'.
								<br />
								<br />
								You're sending address will be the owner!
							</p>

							{/* <button
								onClick={() => {
									// Erklärt wie der Nutzer es claim'en kann
									// alert("Pop")
								}}
								className="bg-white text-blue-600 font-semibold py-1 px-3 rounded-lg hover:bg-gray-100 transition duration-300"
							>
								Claim
							</button> */}
						</div>
					)}

					{status === statusTypes.claimed && (
						<div className="flex w-full flex-col backdrop-blur bg-white bg-opacity-15 text-white p-4 rounded-lg shadow-lg">
							<h3 className="font-bold text-2xl mb-2">
								"{query}" is already claimed!
							</h3>
							<p className="text-xl break-words">
								<span className="font-bold">Owner: </span>
								<span className="font-mono">
									{history.getData().owner}
								</span>
								<br />

								{history.getData().lightningAddress && (
									<>
										<span className="font-bold">
											Lightning-Address:{' '}
										</span>
										{history.getData().lightningAddress}
										<br />
									</>
								)}
								{history.getData().linkTo && (
									<>
										<span className="font-bold">
											LinkTo:{' '}
										</span>
										<a
											href={history.getData().linkTo}
											rel="noopener noreferrer"
											className="text-white underline"
											title={`Link to ${history.getData().linkTo}`}
										>
											{history.getData().linkTo}
										</a>
										<br />
									</>
								)}
								{history.getData().website && (
									<>
										<span className="font-bold">
											Website:{' '}
										</span>
										<a
											href={history.getData().website}
											rel="noopener noreferrer"
											className="text-white underline"
											title={`Website link to ${history.getData().website}`}
										>
											{history.getData().website}
										</a>
										<br />
									</>
								)}
								{history.getData().nostr && (
									<>
										<span className="font-bold">
											Nostr:{' '}
										</span>
										{history.getData().nostr}
									</>
								)}
							</p>
						</div>
					)}
				</div>
			</section>

			<ChromeExtensionInvite />

			<main
				// So its not to wide an wide-screen monitors
				className="w-full max-w-7xl mx-auto p-8"
			>
				<section>
					<h2 className="text-lg md:text-xl font-bold mb-1">
						In Detail:
					</h2>
					<p className="text-xl">
						<b>The core Philosophy</b>
						<br />
						Only normal Bitcoin explorers are required, no other
						server infrastructure or sidechain.
						<br />
						<br />
						<br />
						This section will explore in detail how plebnames work.
						<br />
						- No Token, No pre-mine, no Regulation, no Company. Pure
						Freedom.
						<br />
						- Listing of the different UseCases
						<br />
						- Compare Tabelle (between the classical system.)
						<br />
						- Link zu den Extensions und Integration.
						<br />- Memes
					</p>
				</section>
			</main>

			<Footer />
		</>
	);
}

export default App;
