import { CombinedExplorerAdapter } from './CombinedExplorerAdapter.ts'
import { InputPrevout } from './Transaction.ts'
import * as util from '../util.ts'
import { PlebNameHistory } from '../PlebNameHistory.ts'

export interface ExplorerAdapter {
	getFirstInputOfAddress(address: string): Promise<InputPrevout|undefined>
	getInputsOfAddress(address: string): Promise<InputPrevout[]>
	getOpReturnOutScriptsOfAddress(address: string): Promise<string[]>
}

export const explorerAdapter: ExplorerAdapter = new CombinedExplorerAdapter()

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
		const scripts: string[] = await explorerAdapter.getOpReturnOutScriptsOfAddress(owner)
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