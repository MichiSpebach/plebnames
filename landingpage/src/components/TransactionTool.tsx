import { /*Transaction,*/ Psbt, script } from 'bitcoinjs-lib'
import { bitcoinExplorer, PlebNameHistory, util } from 'plebnames'
import { ReactNode, useEffect, useReducer, useState } from 'react'
import InscriptionForm, { InscriptionKey, predefinedSelectOptions } from './InscriptionForm'
import { InscriptionSelectOption } from './InscriptionSelectOption'
import IframeSlide from './IframeSlide'
import MarkedTextWithCopy from './MarkedTextWithCopy'
import usePlebNameClaimedNames from '../hooks/usePlebNameClaimedNames'
import { TransactionToolInstructionsElectrum } from './TransactionToolInstructionsElectrum'

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
	const [transaction, setTransaction] = useState<{
		transaction: {toHex: () => string}
		minerFeeInSats: number
		senderAddressError?: Error
		senderUtxoError?: Error
		warning?: string
	} | undefined>(undefined)
	const [selectedWallet, setSelectedWallet] = useState<'electrum' | 'electrumDetailed' | 'sparrow' | undefined>('electrum')

	useEffect(() => {
		const tx = generateTransaction({name, senderAddress, senderUtxo, inscriptions: inscriptions.valid?? inscriptions.all, minerFeeInSatsPerVByte, mode})
		setTransaction(tx)
		setValidSenderAddress(tx && !tx.senderAddressError ? senderAddress : undefined)
	}, [name, senderAddress, senderUtxo, inscriptions, minerFeeInSatsPerVByte, mode])

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
						text="Sparrow (coming soon)"
						imgSrc="/wallet-icons/sparrow.png"
						selected={selectedWallet === 'sparrow'}
						disabled={true}
						onClick={() => setSelectedWallet('sparrow')}
					/>
				</div>
			</div>
			
			{selectedWallet === 'electrum' &&
				<TransactionToolInstructionsElectrum/>
			}
			{selectedWallet === 'electrumDetailed' && 
				<div className='sm:mx-2 lg:mx-64'>
					<div  className="mb-4">
						<IframeSlide id="instructions" src='/slides_electrum-instructions/index.html' border={false}  startSlide={history ? 6 : 1}/>
					</div>
				</div>
			}
		</div>
	)
}

function InstructionButton({text, imgSrc, selected, disabled, onClick}: {text: string, imgSrc: string, selected: boolean, disabled?: boolean, onClick: () => void}): ReactNode {
	return (
		<button
			disabled={disabled}
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

function generateTransaction(options: {
	name: string
	senderAddress: string
	senderUtxo?: bitcoinExplorer.UTXO
	inscriptions: InscriptionSelectOption[]
	minerFeeInSatsPerVByte: number
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
		transaction.addInput({hash: options.senderUtxo!.txid, index: options.senderUtxo!.vout})
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