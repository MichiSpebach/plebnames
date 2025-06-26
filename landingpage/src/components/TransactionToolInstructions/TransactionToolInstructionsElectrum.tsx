import  { TransactionToolInstructions, TransactionToolInstructionsProps } from './TransactionToolInstructions.tsx'

export const TransactionToolInstructionsElectrum: React.FC<{name: string, showNostrSlide: boolean}> = ({showNostrSlide, name}) => {
	const slides: TransactionToolInstructionsProps['slides'] = [
		{
			src: '/wallets/electrum/load-transaction.png',
			alt: 'Load Transaction',
			thumbnailTitle: 'Load'
		},
		{
			src: '/wallets/electrum/paste-transaction.png',
			alt: 'Paste Transaction',
			thumbnailTitle: 'Paste'
		},
		{
			src: '/wallets/electrum/sign-transaction.png',
			alt: 'Sign Transaction',
			thumbnailTitle: 'Sign'
		},
		{
			src: '/wallets/electrum/broadcast-transaction.png',
			alt: 'Broadcast Transaction',
			thumbnailTitle: 'Broadcast'
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