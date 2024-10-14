import { /*Transaction,*/ Psbt } from 'bitcoinjs-lib'
import { util } from 'plebnames'
import MarkedTextWithCopy from './MarkedTextWithCopy'
import { useState } from 'react'

interface TransactionToolProps {
	mode: 'claimAndInscribe'|'inscribe'
	name: string
}

export const TransactionTool: React.FC<TransactionToolProps> = ({ name }) => {
	const [senderAddress, setSenderAddress] = useState('');

	return (
		<div>
			<label>
				Your Address:{' '}
				<input
					placeholder='bc1q88758c9etpsvntxncg68ydvhrzh728802aaq7w'
					value={senderAddress}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSenderAddress(event.target.value)}
					className="bg-white/15 border"
				/>
			</label>
			<br />
			<label>
				Inscription:{' '}
				<input
					placeholder={`${name}.nostr=npub1pcqz0y5zt6cfafazcu6h2vf9trghshxhdwypm0g8jf2nmuhmd6rqdcd82u`}
					className="bg-white/15 border"
				/>
			</label>
			<MarkedTextWithCopy clickToCopy>
				{generateClaimNameTransaction(name).toHex()}
			</MarkedTextWithCopy>
		</div>
	)
}

export function generateClaimNameTransaction(name: string): {toHex: () => string} {
	const plebAddress: string = util.generateBech32AddressWithPad(util.normalizeAsciiToBech32(name))

	//const transaction = new Transaction()
	//transaction.addInput(util.hexToBytes('TODO'), 0) // TODO: input needs to be already added to be able to import transaction into wallet
	//transaction.addOutput(util.hexToBytes(util.asciiToHex(plebAddress)), BigInt(546))
	const transaction = new Psbt()
	//transaction.addInput({hash: 'TODO', index: 0}) // TODO: input needs to be already added to be able to import transaction into wallet
	transaction.addOutput({
		address: plebAddress,
		value: BigInt(546)
	})
	return transaction
}