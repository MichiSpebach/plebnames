import { util } from 'plebnames'
import  { TransactionToolInstructions, TransactionToolInstructionsProps } from './TransactionToolInstructions.tsx'

export const TransactionToolInstructionsSparrow: React.FC<{name: string, showNostrSlide: boolean}> = ({showNostrSlide, name}) => {
	const bitcoinExplorerLink = `https://mempool.space/address/${util.generatePlebAddress(name)}`
	const slides: TransactionToolInstructionsProps['slides'] = [
		{
			src: '/wallets/sparrow/load-transaction.png',
			alt: 'Load Transaction',
			thumbnailTitle: 'Load',
			description: 'Open Sparrow and go to "File" > "Open Transaction" > "From Text". Paste the transaction you copied from above and click "OK".'
		},
		{
			src: '/wallets/sparrow/finalize-transaction.png',
			alt: 'Finalize Transaction',
			thumbnailTitle: 'Finalize',
			description: 'Check if everthing is alright, then click "Finalize Transaction for Signing".'
		},
		{
			src: '/wallets/sparrow/sign-transaction.png',
			alt: 'Sign Transaction',
			thumbnailTitle: 'Sign',
			description: <>Click "Sign" and sign the transaction with your hardware wallet. When signing succeeded you should see a button to Broadcast the transaction. After broadcasting you should find everything with any bitcoin explorer: <a target='_blank' href={bitcoinExplorerLink}>{bitcoinExplorerLink}</a>. If signing or broadcasting fails, use Electrum.</>
		}
	]

	if (showNostrSlide) {
		slides.push({
			src: '/wallets/sparrow/nostr.png',
			alt: 'Nostr',
			thumbnailTitle: 'Nostr',
			description: `In your Nostr client (e.g. Primal) open your profile and set '${name}@pleb.name' as 'Verified Nostr Address (NIP-05)'. Now everyone can find you as '${name}@pleb.name'.`
		})
	}

	return <TransactionToolInstructions slides={slides}/>
}