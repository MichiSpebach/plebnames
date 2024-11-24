import './App.css';

import BrowserExtensionBanner from './components/BrowserExtensionBanner';
import CollaborationBanner from './components/CollaborationBanner';
import ExtensionsGallery from './components/ExtensionsGallery';
import Footer from './components/Footer';
import HeaderWithSearch from './components/HeaderWithSearch';
import IframeSlide from './components/IframeSlide';
// import MemeGallery from './components/MemeGallery';
import * as localStorageAdapter from './localStorageAdapter';

function App() {
	return (
		<>
			<HeaderWithSearch />

			{!localStorageAdapter.isHideBrowserExtensionBanner() && <BrowserExtensionBanner />}

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

				<div className='w-full h-[1.75rem]' />
				<IframeSlide />
			</main>

			<Footer />
		</>
	);
}

export default App;
