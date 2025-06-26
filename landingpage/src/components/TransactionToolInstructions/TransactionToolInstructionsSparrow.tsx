import  { TransactionToolInstructions, TransactionToolInstructionsProps } from './TransactionToolInstructions.tsx'

export const TransactionToolInstructionsSparrow: React.FC<{name: string, showNostrSlide: boolean}> = ({showNostrSlide, name}) => {
	const slides: TransactionToolInstructionsProps['slides'] = [
		{
			src: '/wallets/sparrow/load-transaction.png',
			alt: 'Load Transaction',
			thumbnailTitle: 'Load'
		},
		{
			src: '/wallets/sparrow/paste-transaction.png',
			alt: 'Paste Transaction',
			thumbnailTitle: 'Paste'
		},
		{
			src: '/wallets/sparrow/finalize-transaction.png',
			alt: 'Finalize Transaction',
			thumbnailTitle: 'Finalize'
		},
		{
			src: '/wallets/sparrow/sign-transaction.png',
			alt: 'Sign Transaction',
			thumbnailTitle: 'Sign'
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