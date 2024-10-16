import './App.css';

import ChromeExtensionInvite from './components/BrowserExtensionBanner';
import CollaborationBanner from './components/CollaborationBanner';
import ExtensionsGallery from './components/ExtensionsGallery';
import Footer from './components/Footer';
import HeaderWithSearch from './components/HeaderWithSearch';
// import MemeGallery from './components/MemeGallery';

function App() {
	return (
		<>
			<HeaderWithSearch />

			<ChromeExtensionInvite />

			<div id="scroll-to-after-header">
				<CollaborationBanner />
			</div>

			<ExtensionsGallery />

			<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<section>
					<h2 className="mb-1 text-2xl font-bold md:text-3xl">
						The core Philosophy
					</h2>
					<p className="text-xl">
						Only normal Bitcoin explorers are required, no other
						server infrastructure or sidechain.
						<br />
						<br />
						No Token, No pre-mine, No Regulation, No Company.
						<br />
						<b>Pure Freedom.</b>
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
