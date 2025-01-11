import { InputPrevout } from './Transaction.ts'
import type { Transactions } from './Transactions.ts'
import type { UTXO } from './UTXO.ts'
import { RetryingExplorerAdapter } from './RetryingExplorerAdapter.ts'
import * as util from '../util.ts'
import { PlebNameHistory } from '../PlebNameHistory.ts'

export interface ExplorerAdapter {
	getFirstInputOfAddress(address: string): Promise<InputPrevout|undefined>
	getInputsOfAddress(address: string): Promise<InputPrevout[]>
	getOpReturnScriptsOfAddress(address: string): Promise<string[]>
	getTransactionsOfAddress(address: string): Promise<Transactions>
	getUtxosOfAddress(address: string): Promise<UTXO[]>
}

export let explorerAdapter: ExplorerAdapter = new RetryingExplorerAdapter()

export function setCustomExplorerAdapter(explorer: ExplorerAdapter): void {
	explorerAdapter = explorer
}

export async function followNameHistory(name: string, options?: {
	onAddressFetched?: (history: PlebNameHistory, opReturnScripts: string[]) => void
}): Promise<PlebNameHistory|'unclaimed'> {
	const normalizedName: string = util.normalizeAsciiToBech32(name)
	const plebAddress: string = util.generateBech32AddressWithPad(normalizedName)
	const claimerInput: InputPrevout|undefined = await explorerAdapter.getFirstInputOfAddress(plebAddress)
	if (!claimerInput) {
		return 'unclaimed'
	}

	const claimer: string = claimerInput.scriptpubkey_address ?? claimerInput.scriptpubkey
	const history = new PlebNameHistory(name, claimer)
	if (options?.onAddressFetched) {
		options.onAddressFetched(history, [])
	}

	let owner: string|undefined = undefined
	while (owner !== history.getData().owner) {
		owner = history.getData().owner
		const scripts: string[] = await explorerAdapter.getOpReturnScriptsOfAddress(owner)
		for (const script of scripts) {
			history.addChangeFromOpReturnScript(script)
			if (owner !== history.getData().owner) {
				break
			}
		}
		if (options?.onAddressFetched) {
			options.onAddressFetched(history, scripts)
		}
	}

	return history
}

export async function getClaimedNamesOfAddress(address: string): Promise<string[]> {
	const transactions: Transactions = await explorerAdapter.getTransactionsOfAddress(address)
	const names: string[] = []
	for (const transaction of transactions.txs) {
		for (const output of transaction.vout) {
			const outputAddress: string|undefined = (output as any).scriptpubkey_address
			if (!outputAddress) {
				continue
			}
			const outputAddressMainPart = outputAddress.slice(4/*bc1q*/, -6/*checksum*/)
			const name: string|undefined = findPattern(outputAddressMainPart, outputAddressMainPart.length-5/*at least 5 chars have to repeat*/)
			if (name) {
				names.push(util.normalizeBech32ToCapitalizedAscii(name))
			}
		}
	}
	return names
}

function findPattern(input: string, maxLength: number): string|undefined {
	for (let patternLength = 1; patternLength <= maxLength; patternLength++) {
		const pattern = input.substring(0, patternLength)
		if (repeatsPattern(input, pattern)) {
			return pattern
		}
	}
	return undefined
}

function repeatsPattern(input: string, pattern: string): boolean {
	for (let shift = 0; shift < input.length; shift += pattern.length) {
		const comparisonLength: number = Math.min(pattern.length, input.length-shift)
		if (input.substring(shift, shift+comparisonLength) !== pattern.substring(0, comparisonLength)) {
			return false
		}
	}
	return true
}