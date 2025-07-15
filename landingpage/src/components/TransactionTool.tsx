import { /*Transaction,*/ payments, Psbt, script } from 'bitcoinjs-lib'
import * as bip32 from 'bip32'
import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs'
import { bitcoinExplorer, PlebNameHistory, util } from 'plebnames'
import { ReactNode, useEffect, useReducer, useState } from 'react'
import InscriptionForm, { InscriptionKey, predefinedSelectOptions } from './InscriptionForm'
import { InscriptionSelectOption } from './InscriptionSelectOption'
import IframeSlide from './IframeSlide'
import MarkedTextWithCopy from './MarkedTextWithCopy'
import usePlebNameClaimedNames from '../hooks/usePlebNameClaimedNames'
import { TransactionToolInstructionsElectrum } from './TransactionToolInstructions/TransactionToolInstructionsElectrum'
import { TransactionToolInstructionsSparrow } from './TransactionToolInstructions/TransactionToolInstructionsSparrow'

interface TransactionToolProps {
	mode: 'claimAndInscribe'|'inscribe'
	name: string;
	history?: PlebNameHistory;
	preselectedInscriptionOption?: InscriptionKey;
}

const reduceInscriptions = (_: unknown, all: InscriptionSelectOption[]) => {
	let valid: InscriptionSelectOption[]|undefined = all.filter(inscription => inscription.isValid())
	if (valid && valid.length < 1) {
		valid = undefined
	}
	return {all, valid}
}

export const TransactionTool: React.FC<TransactionToolProps> = ({ name, mode, history, preselectedInscriptionOption = 'nostr' }) => {
	const [senderAddress, setSenderAddress] = useState(history?.getData().owner ?? '')
	const [validSenderAddress, setValidSenderAddress] = useState<string|undefined>(undefined)
	const [senderUtxo, setSenderUtxo] = useState<bitcoinExplorer.UTXO|undefined>(undefined)
	const [senderUtxoStatus, setSenderUtxoStatus] = useState<'addressNeeded'|'fetching'|'ok'|Error>('addressNeeded')
	const {claimedNamesOfAddress, getClaimedNamesOfAddress, clearClaimedNamesOfAddress} = usePlebNameClaimedNames()
	const [inscriptions, setInscriptions] = useReducer(reduceInscriptions, reduceInscriptions(undefined, [InscriptionSelectOption.ofOption(preselectedInscriptionOption)]))
	const [minerFeeInSatsPerVByte, setMinerFeeInSatsPerVByte] = useState(8)
	const [bip32Derivation, setBip32Derivation] = useState<{
		masterFingerprint: {input: string, result?: Uint8Array, error?: Error},
		path: {input: string, result?: string, parsedResult?: {index: number, hardened: boolean}[], warning?: string},
		xpub: {input: string, result?: bip32.BIP32Interface, error?: Error}
	}>({masterFingerprint: {input: ''}, path: {input: ''}, xpub: {input: ''}})
	const [transaction, setTransaction] = useState<{
		transaction: {toHex: () => string}
		minerFeeInSats: number
		senderAddressError?: Error
		senderUtxoError?: Error
		warning?: string
	} | undefined>(undefined)
	const [selectedWallet, setSelectedWallet] = useState<'electrum' | 'electrumDetailed' | 'sparrow' | undefined>('electrum')

	useEffect(() => {
		const witnessUtxoScript = senderAddress.length > 0
			? payments.p2wpkh({address: senderAddress}).output
			: undefined
		const witnessUtxo = witnessUtxoScript && senderUtxo ? {
			script: witnessUtxoScript,
			value: BigInt(senderUtxo.value)
		} : undefined
		
		let bip32DerivationResults = undefined
		if (bip32Derivation.masterFingerprint.result && bip32Derivation.path.result && bip32Derivation.xpub.result) {
			let xpubDerivation: bip32.BIP32Interface = bip32Derivation.xpub.result
			const path: {index: number, hardened: boolean}[]|undefined = bip32Derivation.path.parsedResult
			if (path && path.length > 1) {
				xpubDerivation = xpubDerivation.derive(path[path.length-2].index).derive(path[path.length-1].index)
			}
			bip32DerivationResults = {
				masterFingerprint: bip32Derivation.masterFingerprint.result,
				path: bip32Derivation.path.result,
				pubkey: xpubDerivation.publicKey
			}
		}

		const tx = generateTransaction({
			name,
			senderAddress,
			senderUtxo,
			inscriptions: inscriptions.valid?? inscriptions.all,
			minerFeeInSatsPerVByte,
			witnessUtxo,
			bip32Derivation: bip32DerivationResults,
			mode
		})
		setTransaction(tx)
		setValidSenderAddress(tx && !tx.senderAddressError ? senderAddress : undefined)
	}, [name, senderAddress, senderUtxo, inscriptions, minerFeeInSatsPerVByte, bip32Derivation, mode])

	useEffect(() => {
		if (!validSenderAddress) {
			setSenderUtxoStatus('addressNeeded')
			clearClaimedNamesOfAddress()
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
		if (mode === 'claimAndInscribe') {
			getClaimedNamesOfAddress(validSenderAddress)
		} else {
			clearClaimedNamesOfAddress()
		}
	}, [validSenderAddress, mode])

	const reservedFields: string[] = inscriptions.all.map(inscription => inscription.dataField)
	const validTransaction: boolean = !transaction?.senderAddressError && !transaction?.senderUtxoError && senderUtxoStatus === 'ok'

	return (
		<div className='text-lg'>
			{!history &&
				<div className="mb-4 modifyConfigSelect flex flex-row flex-wrap items-center justify-start gap-3">
					<label className='font-bold'>
						Your Address:{' '}
					</label>
					<input
						placeholder='bc1q88758c9etpsvntxncg68ydvhrzh728802aaq7w'
						value={senderAddress}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							event.preventDefault()
							setSenderAddress(event.target.value)
						}}
						className="border-gray-300 flex-1 rounded-md border bg-gray-100 px-3 py-2 text-blue-950 placeholder:text-gray-500"	
					/>
					<br />
				</div>
			}
		
			{inscriptions.all.map((inscription, index) => 
				<InscriptionForm
					className={"mb-4"}
					plebname={name}
					inscription={inscription}
					reservedFields={reservedFields}
					onInscriptionChange={(updatedInscription) => {
						const newInscriptions = [ ...inscriptions.all]
						newInscriptions[index] = updatedInscription
						if (!newInscriptions.at(-1)?.isValueEmpty()) {
							newInscriptions.push(chooseNextInscription(reservedFields))
						} else if (newInscriptions.at(-2)?.isValueEmpty()) {
							newInscriptions.pop()
						}
						setInscriptions(newInscriptions)
					} }
				/>
			)}
			
			<div className="mb-4 modifyConfigSelect flex flex-row flex-wrap items-center justify-start gap-3">
				<label className='font-bold'>Sats/vByte:{' '}</label>
				<input
					type="number"
					min={0}
					value={minerFeeInSatsPerVByte}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						event.preventDefault()
						setMinerFeeInSatsPerVByte(Number(event.target.value))
					}}
					className="w-20 border-gray-300 rounded-md border bg-gray-100 px-3 py-2 text-blue-950"	
				/>
				{`=> ${transaction?.minerFeeInSats} sats miner fee`}
				<br />
			</div>

			<div className="mb-4 modifyConfigSelect grid grid-cols-[auto,1fr] items-center gap-x-3">
				<label className='font-bold'>BIP32 Derivation Master Fingerprint (needed only for Sparrow):{' '}</label>
				<input
					placeholder="01ab8e9f (8 hex characters)"
					value={bip32Derivation.masterFingerprint.input}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						event.preventDefault()
						const input: string = event.target.value
						let result: Uint8Array|undefined = undefined
						let error: Error|undefined = undefined
						if (input.length > 0) {
							if (input.match(/^[0-9a-fA-F]{8}$/)) {
								result = util.hexToBytes(input)
							} else {
								error = new Error("Expected 8 hex characters like 01ab8e9f")
							}
						}
						setBip32Derivation({...bip32Derivation, masterFingerprint: {input, result, error}})
					}}
					className="border-gray-300 rounded-md border bg-gray-100 px-3 py-2 text-blue-950 placeholder:text-gray-500"
				/>
				{bip32Derivation.masterFingerprint.error && (
					<>
						<div></div>
						<div className="text-red-600">{bip32Derivation.masterFingerprint.error.message}</div>
					</>
				)}
				<br />
			</div>
			<div className="mb-4 modifyConfigSelect grid grid-cols-[auto,1fr] items-center gap-x-3">
				<label className='font-bold'>BIP32 Derivation Path (needed only for Sparrow):{' '}</label>
				<input
					placeholder="m/84'/0'/0'/0/0"
					value={bip32Derivation.path.input}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						event.preventDefault()
						const input: string = event.target.value
						let result: string|undefined = undefined
						let parsedResult: {index: number, hardened: boolean}[]|undefined = undefined
						let warning: string|undefined = undefined
						if (input.length > 0) {
							result = input
							if (input.match(/^m(\/\d+'?){5}$/)) {
								parsedResult = input.split('/').slice(1).map(part => {
									const hardened = part.endsWith("'")
									const index = parseInt(hardened ? part.slice(0, -1) : part)
									return { index, hardened }
								})
							} else {
								warning = "Expected to be of form like m/84'/0'/0'/0/0"
							}
						}
						setBip32Derivation({...bip32Derivation, path: {input, result, parsedResult, warning}})
					}}
					className="border-gray-300 rounded-md border bg-gray-100 px-3 py-2 text-blue-950 placeholder:text-gray-500"
				/>
				{bip32Derivation.path.warning && (
					<>
						<div></div>
						<div className="mt-1 rounded-md bg-yellow-300 px-2 py-1 text-black w-fit">{bip32Derivation.path.warning}</div>
					</>
				)}
				<br />
			</div>
			<div className="mb-4 modifyConfigSelect grid grid-cols-[auto,1fr] items-center gap-x-3">
				<label className='font-bold'>BIP32 Derivation xpub (needed only for Sparrow):{' '}</label>
				<input
					placeholder="xpub..."
					value={bip32Derivation.xpub.input}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						event.preventDefault()
						const input: string = event.target.value
						let result: bip32.BIP32Interface|undefined = undefined
						let error: Error|undefined = undefined
						if (input.length > 0) {
							try {
								result = bip32.BIP32Factory(ecc).fromBase58(input)
							} catch (e: unknown) {
								error = toError(e)
							}
						}
						setBip32Derivation({...bip32Derivation, xpub: {input, result, error}})
					}}
					className="border-gray-300 rounded-md border bg-gray-100 px-3 py-2 text-blue-950 placeholder:text-gray-500"
				/>
				{bip32Derivation.xpub.error && (
					<>
						<div></div>
						<div className="text-red-600">{bip32Derivation.xpub.error.message}</div>
					</>
				)}
				<br />
			</div>

			<hr className="mt-2 mb-2" />

			<div className='font-bold mb-2'>Generated transaction - copy and paste into Bitcoin wallet: {' '}</div>
			<div style={validTransaction && inscriptions.valid && claimedNamesOfAddress.length === 0 ? {} : {pointerEvents: 'none', userSelect: 'none', opacity: '0.5'}}>
				<MarkedTextWithCopy clickToCopy>
					{transaction?.transaction.toHex()}
				</MarkedTextWithCopy>
			</div>

			{!senderAddress
				? <div className="text-red-600">Input 'Your Address' to generate a valid transaction.</div>
				: <div className="text-red-600">
					{transaction?.senderAddressError && <div>{String(transaction.senderAddressError)}</div>}
					{senderUtxoStatus === 'fetching' && <div>Fetching UTXO...</div>}
					{senderUtxoStatus instanceof Error && <div>Error while fetching UTXO from 'Your Address': {senderUtxoStatus.message}</div>}
					{transaction?.senderUtxoError && <div>Error with UTXO of 'Your Address': {transaction.senderUtxoError.message}</div>}
					{claimedNamesOfAddress.length > 0 && <div>
						Hi {claimedNamesOfAddress[0]}, are you sure you want to claim '{util.normalizeBech32ToCapitalizedAscii(name)}' from the same address? Just use another address.<br/>
						Why is this important:<br/>
						- <b>Privacy:</b> Having multiple names attached to the same address is not good for privacy because everybody can relate the names to each other (as you see).<br/>
						- <b>Ownership transfer:</b> Ownership transfers with smart contracts invalidate all other open smart contracts of that address because they all spend the same UTXO.
						So having multiple names on the same address makes them harder to sell.
					</div>}
					{validTransaction && claimedNamesOfAddress.length === 0 && !inscriptions.valid && <div>Input at least one valid inscription.</div>}
				</div>
			}
			{transaction?.warning &&
				<p className="mb-2 mt-2 rounded-md bg-yellow-300 p-2 text-black">
					{transaction.warning}
				</p>
			}

			<div className="mt-2">
				<div className="flex flex-row gap-3 border-b">
					<InstructionButton
						text="Electrum"
						imgSrc="/wallet-icons/electrum.png"
						selected={selectedWallet === 'electrum'}
						onClick={() => setSelectedWallet('electrum')}
					/>
					<InstructionButton
						text="Electrum Detailed"
						imgSrc="/wallet-icons/electrum.png"
						selected={selectedWallet === 'electrumDetailed'}
						onClick={() => setSelectedWallet('electrumDetailed')}
					/>
					<InstructionButton
						text="Sparrow"
						imgSrc="/wallet-icons/sparrow.png"
						selected={selectedWallet === 'sparrow'}
						onClick={() => setSelectedWallet('sparrow')}
					/>
				</div>
			</div>
			
			{selectedWallet === 'electrum' &&
				<TransactionToolInstructionsElectrum name={name} showNostrSlide={!!inscriptions.all.find(inscription => inscription.option === 'nostr')}/>
			}
			{selectedWallet === 'electrumDetailed' && 
				<div className='sm:mx-2 lg:mx-64'>
					<div  className="mb-4">
						<IframeSlide id="instructions" src='/slides_electrum-instructions/index.html' border={false}  startSlide={history ? 6 : 1}/>
					</div>
				</div>
			}
			{selectedWallet === 'sparrow' &&
				<>
					<div className='text-red-600 leading-none text-center mt-2'>
						Signing and broadcasting might not work with some hardware wallets, use Electrum if you have issues!
					</div>
					<TransactionToolInstructionsSparrow name={name} showNostrSlide={!!inscriptions.all.find(inscription => inscription.option === 'nostr')}/>
				</>
			}
		</div>
	)
}

function InstructionButton({text, imgSrc, selected, onClick}: {text: string, imgSrc: string, selected: boolean, onClick: () => void}): ReactNode {
	return (
		<button
			className={`px-4 py-2 flex items-center gap-1 ${selected ? 'border-b-2 border-amber-500' : ''}`}
			onClick={onClick}
		>
			<img src={imgSrc} alt={text} className="h-8 w-8" />
			{text}
		</button>
	)
}

function chooseNextInscription(reservedFields: string[]): InscriptionSelectOption {
	const optionKey: InscriptionKey = predefinedSelectOptions.find(option => option.key !== 'owner'&& !reservedFields.includes(option.key))?.key?? 'custom'
	return InscriptionSelectOption.ofOption(optionKey)
}

/**
 * @param options.witnessUtxo needed only for Sparrow wallet (as of 2.2.3), otherwise undefined
 * @param options.bip32Derivation needed only for Sparrow wallet (as of 2.2.3), otherwise undefined
 */
function generateTransaction(options: {
	name: string
	senderAddress: string
	senderUtxo?: bitcoinExplorer.UTXO
	inscriptions: InscriptionSelectOption[]
	minerFeeInSatsPerVByte: number
	witnessUtxo?: {script: Uint8Array, value: bigint}
	bip32Derivation?: {masterFingerprint: Uint8Array, path: string, pubkey: Uint8Array}
	mode: 'claimAndInscribe'|'inscribe'
}): {
	transaction: {toHex: () => string}
	minerFeeInSats: number
	senderAddressError?: Error
	senderUtxoError?: Error
	warning?: string
} {
	//const transaction = new Transaction()
	//transaction.addInput(util.hexToBytes('TODO'), 0) // TODO: input needs to be already added to be able to import transaction into wallet
	//transaction.addOutput(util.hexToBytes(util.asciiToHex(plebAddress)), BigInt(546))
	const transaction = new Psbt()
	let senderAddressError: Error|undefined = undefined
	let senderUtxoError: Error|undefined = undefined

	try {
		transaction.addInput({
			hash: options.senderUtxo!.txid,
			index: options.senderUtxo!.vout,
			witnessUtxo: options.witnessUtxo,
			//bip32Derivation: options.bip32Derivation ? [options.bip32Derivation] : undefined // Key type bip32Derivation must be an array
		})
		if (options.bip32Derivation) {
			transaction.updateInput(0, {bip32Derivation: [options.bip32Derivation]})
		}
	} catch (error: unknown) {
		senderUtxoError = toError(error)
	}
	let restValueInSats: number = options.senderUtxo?.value ?? 21_000_000*10**8

	if (options.mode === 'claimAndInscribe') {
		transaction.addOutput({
			address: util.generatePlebAddress(options.name),
			value: BigInt(546)
		})
		restValueInSats -= 546
	}

	let warning: string|undefined = undefined
	if (options.inscriptions.length > 0) {
		/** combine because transactions with more than one OP_RETURN are not relayed/propagated through the mempool */
		const combinedInscriptions: string = options.inscriptions.map(inscription => inscription.getEncodedInAscii(options.name)).join(';')
		const opReturnData: Uint8Array = util.asciiToBytes(combinedInscriptions)
		transaction.addOutput({
			script: createOpReturnScript(opReturnData),
			value: BigInt(0)
		})
		if (opReturnData.length > 80) {
			warning = `Combined length of inscriptions is ${opReturnData.length} > 80 bytes. Distribute them over more then one transaction.`
		}
	}

	const vbyteLength: number = transaction.toHex().length/2 + 48 // 48 includes rest output and signature
	const minerFeeInSats: number = Math.round(vbyteLength * options.minerFeeInSatsPerVByte)
	restValueInSats -= minerFeeInSats
	try {
		transaction.addOutput({address: options.senderAddress, value: BigInt(restValueInSats)})
	} catch (error: unknown) {
		senderAddressError = toError(error)
	}

	return {
		transaction,
		minerFeeInSats,
		senderAddressError,
		senderUtxoError,
		warning
	}
}

function createOpReturnScript(opReturnData: Uint8Array): Uint8Array {
	const opReturnScript: number[] = [script.OPS['OP_RETURN']]
	if (opReturnData.length > 75) {
		opReturnScript.push(script.OPS['OP_PUSHDATA1'])
	}
	opReturnScript.push(opReturnData.length) // OP_PUSHBYTES_1 to OP_PUSHBYTES_75 or number of bytes following
	opReturnScript.push(...opReturnData)
	return new Uint8Array(opReturnScript)
}

function toError(errorOfUnknownType: unknown): Error {
	if (errorOfUnknownType instanceof Error) {
		return errorOfUnknownType
	}
	return new Error(String(errorOfUnknownType))
}