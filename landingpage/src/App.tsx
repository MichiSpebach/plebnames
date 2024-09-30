import './App.css';

import * as plebNames from 'plebnames';
import { PiSpinnerGapBold } from 'react-icons/pi';
import ChromeExtensionInvite from './components/BrowserExtensionBanner';
import CollaborationBanner from './components/CollaborationBanner';
import Footer from './components/Footer';
import SearchInput from './components/SearchInput';
import usePlebNameSearch, { StatusTypes } from './hooks/usePlebNameSearch';
import ExtensionsGallery from './components/ExtensionsGallery';
import AlterConfigForName from './components/AlterConfigForName';
// import MemeGallery from './components/MemeGallery';

function App() {
	const { handleSearch, history, queryString, status } = usePlebNameSearch();

	return (
		<>
			<section
				id="header"
				className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white transition-all"
			>
				<div className="mx-auto w-full max-w-7xl overflow-hidden p-8">
					<h1 className="mb-3 text-5xl font-bold md:text-7xl">
						PlebNames
					</h1>
					<h2 className="mb-12 text-3xl md:text-5xl">
						Piggybacked names on Bitcoin, just Bitcoin!
					</h2>

					<div className="mb-6 w-full max-w-xs">
						<SearchInput onSearch={handleSearch} />
					</div>

					{status === StatusTypes.Loading && (
						<div className="lex w-full flex-col gap-3 rounded-xl bg-white bg-opacity-15 p-4 text-white shadow-lg backdrop-blur">
							<h3 className="animate-pulse text-2xl font-bold">
								Loading data for "{queryString}" ...
							</h3>
							<PiSpinnerGapBold
								size={34}
								className="animate-spin"
							/>
						</div>
					)}

					{status === StatusTypes.Unclaimed && (
						<div className="flex w-full flex-col gap-3 rounded-xl bg-white bg-opacity-15 p-4 text-white shadow-lg backdrop-blur">
							<h3 className="mb-2 text-2xl font-bold">
								"{queryString}" is still unclaimed!
							</h3>

							<p className="break-words text-lg">
								You can claim it by sending a minimum amount of
								satoshis (atm 546) to '
								{plebNames.util.generateBech32AddressWithPad(
									plebNames.util.normalizeAsciiToBech32(
										queryString,
									),
								)}
								'.
								<br />
								<br />
								Your sending address will be the owner!
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

					{status === StatusTypes.Claimed && (
						<div className="flex w-full flex-col rounded-lg bg-white bg-opacity-15 p-4 text-white shadow-lg backdrop-blur">
							<h3 className="mb-2 text-2xl font-bold">
								"{queryString}" is already claimed!
							</h3>
							<p className="break-words text-xl">
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

							<hr className="my-4" />

							<AlterConfigForName
								currentOwner={history.getData().owner}
								queryString={queryString}
							/>
						</div>
					)}
				</div>
			</section>

			<ChromeExtensionInvite />

			<CollaborationBanner />

			<ExtensionsGallery />

			<main className="mx-auto w-full max-w-7xl p-8">
				<section>
					<h2 className="mb-1 text-2xl font-bold md:text-3xl">
						In Detail
					</h2>
					<p className="text-xl">
						<b>The core Philosophy</b>
						<br />
						Only normal Bitcoin explorers are required, no other
						server infrastructure or sidechain.
						<br />
						- No Token, No pre-mine, no Regulation, no Company. Pure
						Freedom.
						<br />
						{/* - Listing of the different UseCases
						<br />- Compare Tabelle (between the classic system.) */}
					</p>
				</section>
				{/* <MemeGallery /> */}
			</main>

			<Footer />
		</>
	);
}

export default App;
