import { util } from 'plebnames'
import  { TransactionToolInstructions, TransactionToolInstructionsProps } from './TransactionToolInstructions.tsx'

export const TransactionToolInstructionsElectrum: React.FC<{name: string, showNostrSlide: boolean}> = ({showNostrSlide, name}) => {
	const bitcoinExplorerLink = `https://mempool.space/address/${util.generatePlebAddress(name)}`
	const slides: TransactionToolInstructionsProps['slides'] = [
		{
			src: '/wallets/electrum/load-transaction.png',
			alt: 'Load Transaction',
			thumbnailTitle: 'Load',
			description: 'Open Electrum and go to "Tools" > "Load transaction" > "From text". Paste the transaction you copied from above and click "Load transaction".'
		},
		{
			src: '/wallets/electrum/sign-transaction.png',
			alt: 'Sign Transaction',
			thumbnailTitle: 'Sign',
			description: 'Check if everything is alright, then click "Sign" and sign the transaction with your hardware wallet.'
		},
		{
			src: '/wallets/electrum/broadcast-transaction.png',
			alt: 'Broadcast Transaction',
			thumbnailTitle: 'Broadcast',
			description: <>Click "Broadcast". Now you can find everything with any bitcoin explorer: <a target='_blank' href={bitcoinExplorerLink}>{bitcoinExplorerLink}</a>.</>
		}
	]

	if (showNostrSlide) {
		slides.push({
			src: '/wallets/electrum/nostr.png',
			alt: 'Nostr',
			thumbnailTitle: 'Nostr',
			description: `In your Nostr client (e.g. Primal) open your profile and set '${name}@pleb.name' as 'Verified Nostr Address (NIP-05)'. Now everyone can find you as '${name}@pleb.name'.`
		})
	}

	return <TransactionToolInstructions slides={slides}/>
}