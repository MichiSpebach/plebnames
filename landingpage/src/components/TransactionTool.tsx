import { /*Transaction,*/ Psbt, script } from 'bitcoinjs-lib'
import { bitcoinExplorer, PlebNameHistory, util } from 'plebnames'
import MarkedTextWithCopy from './MarkedTextWithCopy'
import { useEffect, useState } from 'react'
import DropDownContent from './HeaderWithSearch/DropDownContent'
import AlterConfigForName from './AlterConfigForName'

interface TransactionToolProps {
	mode: 'claimAndInscribe'|'inscribe'
	name: string;
	history?: PlebNameHistory;
}

export const TransactionTool: React.FC<TransactionToolProps> = ({ name, mode, history }) => {
	const [senderAddress, setSenderAddress] = useState(history?.getData().owner ??'')
	const [validSenderAddress, setValidSenderAddress] = useState<string|undefined>(undefined)
	const [senderUtxo, setSenderUtxo] = useState<bitcoinExplorer.UTXO|undefined>(undefined)
	const [senderUtxoStatus, setSenderUtxoStatus] = useState<'addressNeeded'|'fetching'|'ok'|Error>('addressNeeded')
	const [inscriptions, setInscriptions] = useState([''])
	const [transaction, setTransaction] = useState<{
		transaction: {toHex: () => string}
		senderAddressError?: Error
		senderUtxoError?: Error
	} | undefined>(undefined)

	useEffect(() => {
		const tx = generateTransaction({name, senderAddress, senderUtxo, inscriptions, mode})
		setTransaction(tx)
		setValidSenderAddress(tx && !tx.senderAddressError ? senderAddress : undefined)
	}, [name, senderAddress, senderUtxo, inscriptions, mode])

	useEffect(() => {
		if (!validSenderAddress) {
			setSenderUtxoStatus('addressNeeded')
			return
		}
		setSenderUtxoStatus('fetching')
		bitcoinExplorer.explorerAdapter.getUtxosOfAddress(validSenderAddress).then(utxos => {
			if (utxos.length < 1) {
				setSenderUtxoStatus(new Error(`Address does not have unspent transaction outputs (UTXOs), send something to '${validSenderAddress}' first.`))
				setSenderUtxo(undefined)
			} else {
				setSenderUtxoStatus('ok')
				setSenderUtxo(utxos[0])
			}
		}).catch(error => {
			setSenderUtxoStatus(toError(error))
			setSenderUtxo(undefined)
		})
	}, [validSenderAddress])

	const validTransaction: boolean = !transaction?.senderAddressError && !transaction?.senderUtxoError && senderUtxoStatus === 'ok'

	return (

		<div className='flex flex-col '>
			{!history && 	
			<div className="modifyConfigSelect flex flex-row flex-wrap items-center justify-start gap-3">	<label>
				Your Address:{' '}
				</label>
				<input
					placeholder='bc1q88758c9etpsvntxncg68ydvhrzh728802aaq7w'
					value={senderAddress}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSenderAddress(event.target.value)}
					className="border-gray-30 flex-1 rounded-md border bg-gray-100 px-3 py-2 text-blue-950 placeholder:text-gray-500"	
				/>
			<br /></div>}
		

				{<AlterConfigForName queryString={name} currentOwner={senderAddress} onInscriptionChange={setInscriptions}/> }

			<div style={validTransaction && inscriptions[0] ? {} : {pointerEvents: 'none', userSelect: 'none', opacity: '0.5'}}>
				<MarkedTextWithCopy clickToCopy>
					{transaction?.transaction.toHex()}
				</MarkedTextWithCopy>
			</div>
			{!senderAddress
				? <div>Input 'Your Address' to generate a valid transaction.</div>
				: <div>
					{transaction?.senderAddressError && <div>{String(transaction.senderAddressError)}</div>}
					{senderUtxoStatus === 'fetching' && <div>Fetching UTXO...</div>}
					{senderUtxoStatus instanceof Error && <div>Error while fetching UTXO from 'Your Address': {senderUtxoStatus.message}</div>}
					{transaction?.senderUtxoError && <div>Error with UTXO of 'Your Address': {transaction.senderUtxoError.message}</div>}
					{!inscriptions[0] && validTransaction && <div>Input at least one 'Inscription'.</div>}
				</div>
			}
		</div>
	)
}

function generateTransaction(options: {
	name: string
	senderAddress: string
	senderUtxo?: bitcoinExplorer.UTXO
	inscriptions: string[]
	//minerFeeInSatsPerVByte: number TODO
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
		transaction.addInput({hash: options.senderUtxo!.txid, index: options.senderUtxo!.vout})
	} catch (error: unknown) {
		senderUtxoError = toError(error)
	}
	let restValueInSats: number = options.senderUtxo?.value ?? 21_000_000*10**8

	if (options.mode === 'claimAndInscribe') {
		const plebAddress = util.generateBech32AddressWithPad(util.normalizeAsciiToBech32(options.name))
		transaction.addOutput({
			address: plebAddress,
			value: BigInt(546)
		})
		restValueInSats -= 546
	}

	for (const inscription of options.inscriptions) {
		const opReturnData: Uint8Array = util.asciiToBytes(inscription)
		transaction.addOutput({ // TODO: handle case for opReturnData.length > 75
			script: new Uint8Array([script.OPS['OP_RETURN'], opReturnData.length, ...opReturnData]),
			value: BigInt(0)
		})
	}

	restValueInSats -= 2000 // TODO: replace fixed minerFee, calculate with minerFeeInSatsPerVByte and size of transaction
	try {
		transaction.addOutput({address: options.senderAddress, value: BigInt(restValueInSats)})
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