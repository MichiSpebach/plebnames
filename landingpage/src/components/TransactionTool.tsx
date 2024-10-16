import { /*Transaction,*/ Psbt, script } from 'bitcoinjs-lib'
import { util } from 'plebnames'
import MarkedTextWithCopy from './MarkedTextWithCopy'
import { useEffect, useState } from 'react'

interface TransactionToolProps {
	mode: 'claimAndInscribe'|'inscribe'
	name: string
}

export const TransactionTool: React.FC<TransactionToolProps> = ({ name, mode }) => {
	const [senderAddress, setSenderAddress] = useState('')
	//const [senderAddressError, setSenderAddressError] = useState<Error|undefined>(undefined)
	let senderAddressError: Error|undefined = undefined
	const [senderUtxo, setSenderUtxo] = useState<{hash: string, index: number}|Error|'fetching'>('fetching')
	const [inscriptions, setInscriptions] = useState([''])
	const [transaction, setTransaction] = useState(generateClaimNameTransaction(name))

	useEffect(() => {
		try {
			setSenderUtxo({hash: senderAddress, index: 0}) // TODO: bitcoinExplorer.getOldestUtxoOfAddress(address).then(...)
		} catch (error: unknown) {
			if (error instanceof Error) {
				setSenderUtxo(error)
			} else {
				setSenderUtxo(new Error(String(error)))
			}
		}
	}, [senderAddress])

	useEffect(() => {
		setTransaction(generateClaimNameTransaction(name))
	}, [name, senderUtxo, inscriptions])

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
			<label> {/* TODO: use <AlterConfigForName queryString={name} currentOwner={senderAddress}/> instead */}
				Inscription:{' '}
				<input
					placeholder={`${name}.nostr=npub1pcqz0y5zt6cfafazcu6h2vf9trghshxhdwypm0g8jf2nmuhmd6rqdcd82u`}
					value={inscriptions[0]}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => setInscriptions(inscriptions.map((inscription, index) => {
						if (index === 0) {
							return event.target.value
						}
						return inscription
					}))}
					className="bg-white/15 border"
				/>
			</label>
			<MarkedTextWithCopy clickToCopy>
				{transaction.toHex()}
			</MarkedTextWithCopy>
			{senderAddressError && <div>{String(senderAddressError)}</div>}
			{senderUtxo === 'fetching' && <div>Fetching senderUtxo...</div>}
			{senderUtxo instanceof Error && <div>Error while getting senderUtxo from 'Your Address': {String(senderUtxo)}</div>}
		</div>
	)
	
	function generateClaimNameTransaction(name: string): {toHex: () => string} {
		//const transaction = new Transaction()
		//transaction.addInput(util.hexToBytes('TODO'), 0) // TODO: input needs to be already added to be able to import transaction into wallet
		//transaction.addOutput(util.hexToBytes(util.asciiToHex(plebAddress)), BigInt(546))
		const transaction = new Psbt()

		if (!(senderUtxo instanceof Error) && senderUtxo !== 'fetching') {
			try {
				transaction.addInput(senderUtxo)
			} catch (error: unknown) {
				if (error instanceof Error) {
					setSenderUtxo(error)
				} else {
					setSenderUtxo(new Error(String(error)))
				}
			}
		}

		if (mode === 'claimAndInscribe') {
			const plebAddress = util.generateBech32AddressWithPad(util.normalizeAsciiToBech32(name))
			transaction.addOutput({
				address: plebAddress,
				value: BigInt(546)
			})
		}

		for (const inscription of inscriptions) {
			transaction.addOutput({script: new Uint8Array([script.OPS['OP_RETURN'], ...asciiToBytes(inscription)]), value: BigInt(0)})
		}

		try {
			transaction.addOutput({address: senderAddress, value: BigInt(21_000_000*10**8)}) // TODO: transfer rest to sender
			//setSenderAddressError(undefined)
		} catch (error: unknown) {
			if (error instanceof Error) {
				senderAddressError = error
				//setSenderAddressError(error)
			} else {
				senderAddressError = new Error(String(error))
				//setSenderAddressError(new Error(String(error)))
			}
		}

		return transaction
	}
}

/** @deprecated add this to util instead */
function asciiToBytes(ascii: string): Uint8Array {
	return util.hexToBytes(util.asciiToHex(ascii))
}