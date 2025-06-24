import  { TransactionToolInstructions } from './TransactionToolInstructions.tsx'

export const TransactionToolInstructionsElectrum: React.FC<{}> = ({}) => {
	return (
		<TransactionToolInstructions slides={[
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
			},
			{
				src: '/wallets/electrum/nostr.png',
				alt: 'Nostr',
				thumbnailTitle: 'Nostr'
			}
		]}/>
	)
}