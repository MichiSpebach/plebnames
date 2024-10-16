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
	const [senderUtxo, setSenderUtxo] = useState<{hash: string, index: number}|Error|'fetching'>('fetching')
	const [inscriptions, setInscriptions] = useState([''])
	const [transaction, setTransaction] = useState<{
		transaction: {toHex: () => string}
		senderAddressError?: Error
		senderUtxoError?: Error
	} | undefined>(undefined)

	useEffect(() => {
		try {
			setSenderUtxo({hash: util.asciiToHex(senderAddress).substring(0, 64), index: 0}) // TODO: bitcoinExplorer.getOldestUtxoOfAddress(address).then(...)
		} catch (error: unknown) {
			setSenderUtxo(toError(error))
		}
	}, [senderAddress])

	useEffect(() => {
		if (senderUtxo !== 'fetching' && !(senderUtxo instanceof Error)) {
			setTransaction(generateTransaction({name, senderAddress, senderUtxo, inscriptions, mode}))
		}
	}, [name, senderAddress, senderUtxo, inscriptions, mode])

	const validTransaction: boolean = !!inscriptions[0] && !transaction?.senderAddressError && !transaction?.senderUtxoError

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
			<div style={validTransaction ? {} : {pointerEvents: 'none', userSelect: 'none', opacity: '0.5'}}>
				<MarkedTextWithCopy clickToCopy>
					{transaction?.transaction.toHex()}
				</MarkedTextWithCopy>
			</div>
			{!senderAddress
				? <div>Input 'Your Address' to generate a valid transaction.</div>
				: <div>
					{transaction?.senderAddressError && <div>{String(transaction.senderAddressError)}</div>}
					{senderUtxo === 'fetching' && <div>Fetching UTXO...</div>}
					{senderUtxo instanceof Error && <div>Error while fetching UTXO from 'Your Address': {String(senderUtxo)}</div>}
					{transaction?.senderUtxoError && <div>Error with UTXO of 'Your Address': {String(transaction.senderUtxoError)}</div>}
					{!inscriptions[0] && !transaction?.senderAddressError && !transaction?.senderUtxoError && <div>Input at least one 'Inscription'.</div>}
				</div>
			}
		</div>
	)
}

function generateTransaction(options: {
	name: string
	senderAddress: string
	senderUtxo: {hash: string, index: number}
	inscriptions: string[]
	mode: 'claimAndInscribe'|'inscribe'
}): {
	transaction: {toHex: () => string}
	senderAddressError?: Error
	senderUtxoError?: Error
} {
	//const transaction = new Transaction()
	//transaction.addInput(util.hexToBytes('TODO'), 0) // TODO: input needs to be already added to be able to import transaction into wallet
	//transaction.addOutput(util.hexToBytes(util.asciiToHex(plebAddress)), BigInt(546))
	const transaction = new Psbt()
	let senderAddressError: Error|undefined = undefined
	let senderUtxoError: Error|undefined = undefined

	try {
		transaction.addInput(options.senderUtxo)
	} catch (error: unknown) {
		senderUtxoError = toError(error)
	}

	if (options.mode === 'claimAndInscribe') {
		const plebAddress = util.generateBech32AddressWithPad(util.normalizeAsciiToBech32(options.name))
		transaction.addOutput({
			address: plebAddress,
			value: BigInt(546)
		})
	}

	for (const inscription of options.inscriptions) {
		transaction.addOutput({script: new Uint8Array([script.OPS['OP_RETURN'], ...asciiToBytes(inscription)]), value: BigInt(0)})
	}

	try {
		transaction.addOutput({address: options.senderAddress, value: BigInt(21_000_000*10**8)}) // TODO: transfer rest to sender
	} catch (error: unknown) {
		senderAddressError = toError(error)
	}

	return {
		transaction,
		senderAddressError,
		senderUtxoError
	}
}

function toError(errorOfUnknownType: unknown): Error {
	if (errorOfUnknownType instanceof Error) {
		return errorOfUnknownType
	}
	return new Error(String(errorOfUnknownType))
}

/** @deprecated add this to util instead */
function asciiToBytes(ascii: string): Uint8Array {
	return util.hexToBytes(util.asciiToHex(ascii))
}