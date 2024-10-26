import { util } from 'plebnames';
import { useRef } from 'react';
import { PiSpinnerGapBold } from 'react-icons/pi';
import usePlebNameSearch, { StatusTypes } from '../../hooks/usePlebNameSearch';
import useHeaderSpacer from '@/src/hooks/useHeaderSpacer';
import SearchInput from '../SearchInput';
import ClaimedContent from './ClaimedContent';
import PAExplanationView from './PAExplanationView';
import './../../App.css';
import AlterConfigForName from '../AlterConfigForName';
import MarkedTextWithCopy from '../MarkedTextWithCopy';
import ScrollToNextSectionButton from '../ScrollToNextSectionButton';
import { TransactionTool } from '../TransactionTool';
import DropDownContent from './DropDownContent';

/* <hr className="my-3" /> */
const MyHr = () => <hr className="my-5" />;

function HeaderWithSearch() {
	let { handleSearch, data } = usePlebNameSearch();
	const { history, paExplanation, queryString, status } = data;

	const overflowBoxRef = useRef<HTMLDivElement>(null);
	const { spacerHeight, fitsInHeader } = useHeaderSpacer(overflowBoxRef, [
		status,
	]);

	return (
		<section
			id="header"
			className="flex h-lvh flex-col items-center justify-center overflow-y-visible bg-gradient-to-b from-blue-500 to-indigo-600 text-white transition-all"
			style={{
				marginBottom: spacerHeight,
			}}
		>
			<div
				id="content"
				// className="relative mx-auto w-full max-w-7xl overflow-visible p-8"
				className="relative mx-auto w-full max-w-7xl overflow-visible px-4 py-8 sm:px-6 lg:px-8"
			>
				{/* The Normal Header Content, which is centered */}
				<>
					<h1 className="mb-3 text-5xl font-bold md:text-7xl">
						PlebNames
					</h1>
					<h2 className="mb-8 text-3xl md:text-5xl">
						Piggybacked names on Bitcoin, just Bitcoin!
					</h2>

					<div className="w-full max-w-xs">
						<SearchInput onSearch={handleSearch} />
					</div>
				</>

				{/* The Overflow content */}
				<div
					id="resultOverflowBox"
					ref={overflowBoxRef}
					className="absolute left-0 right-0 top-full"
					style={{
						top: 'calc(100% - 0.8rem)',
					}}
				>
					{/* <div className="p-4 mx-8  flex-1 flex flex-col gap-3 rounded-xl bg-white text-blue-950 shadow-md"> */}
					{/* <div className="p-4 mx-8  flex-1 flex flex-col gap-3 rounded-xl bg-gradient-to-l from-indigo-100 to-indigo-900 text-white shadow-md"> */}
					<div
						className="relative mx-4 flex flex-1 flex-col rounded-xl border border-gray-200 bg-white p-4 text-blue-950 shadow-sm sm:mx-6 lg:mx-8"
						style={
							status === StatusTypes.NotSearched
								? {
										display: 'none',
									}
								: undefined
						}
					>
						{status === StatusTypes.Loading && (
							<>
								<h3 className="animate-pulse text-2xl font-bold">
									Loading data for "{queryString}" ...
								</h3>
								<PiSpinnerGapBold
									size={34}
									className="animate-spin"
								/>
							</>
						)}

						{status === StatusTypes.Unclaimed && (
							<>
								<h3 className="mb-2 text-2xl font-bold">
									"{queryString}" is still unclaimed!
								</h3>

								<p className="break-words text-lg">
									You can claim it by sending a minimum amount
									of satoshis (atm 546) to{' '}
									<MarkedTextWithCopy clickToCopy>
										{util.generateBech32AddressWithPad(
											util.normalizeAsciiToBech32(
												queryString,
											),
										)}
									</MarkedTextWithCopy>
									<br />
									Or import below transaction into your wallet (e.g. Electrum or Sparrow):
									
									<br />
									Your sending address will act as the owner,
									so ensure it's your own non-custodial wallet
									address and{' '}
									<b>avoid using custodial addresses.</b>
								</p>

								<MyHr />

								<h3 className="mb-2 text-2xl font-bold text-blue-950">Claim & Inscribe</h3>

								<TransactionTool mode='claimAndInscribe' name={queryString} />
								
								<MyHr />
								
								<PAExplanationView {...paExplanation} />

							</>
						)}

						{status === StatusTypes.Claimed && (
							<>
								<ClaimedContent
									history={history}
									queryString={queryString}
								/>

								<MyHr />

								<DropDownContent title={'Add or modify inscriptions'}>
									<TransactionTool mode='inscribe' name={queryString}	history={history}/>
								</DropDownContent>
								

								<MyHr />

								<PAExplanationView {...paExplanation} />
							</>
						)}
					</div>
				</div>
			</div>

			<ScrollToNextSectionButton
				isVisible={fitsInHeader}
				to="scroll-to-after-header"
			/>
		</section>
	);
	{
		/* <div style={{ height: spacerHeight }}></div> test */
	}
}

export default HeaderWithSearch;
