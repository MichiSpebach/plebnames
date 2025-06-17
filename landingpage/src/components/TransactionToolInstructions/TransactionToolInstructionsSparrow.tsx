import  { TransactionToolInstructions } from './TransactionToolInstructions.tsx'

export const TransactionToolInstructionsSparrow: React.FC<{}> = ({}) => {
	return (
		<TransactionToolInstructions slides={[
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
		]}/>
	)
}