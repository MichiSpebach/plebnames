import './App.css';

import CollaborationBanner from './components/CollaborationBanner';
import ExtensionsGallery from './components/ExtensionsGallery';
import Footer from './components/Footer';
import HeaderWithSearch from './components/HeaderWithSearch';	
import IframeSlide from './components/IframeSlide';
// import MemeGallery from './components/MemeGallery';

function App() {
	return (
		<>
			<HeaderWithSearch />

			<div id="scroll-to-after-header"></div>

			<div  className="mt-8 mb-16 mx-4 sm:mx-4 lg:mx-96">
				<IframeSlide />
			</div>


			{/* {!localStorageAdapter.isHideBrowserExtensionBanner() && <BrowserExtensionBanner />} */}

		
			<CollaborationBanner />
		

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
				
			</main>

			<Footer />
		</>
	);
}

export default App;
