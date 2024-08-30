import { CombinedExplorerAdapter } from './CombinedExplorerAdapter.ts'
import { InputPrevout } from './Transaction.ts'

export interface ExplorerAdapter {
	getFirstInputOfAddress(address: string): Promise<InputPrevout|undefined>
	getInputsOfAddress(address: string): Promise<InputPrevout[]>
	getOpReturnOutScriptsOfAddress(address: string): Promise<string[]>
}

export const explorerAdapter: ExplorerAdapter = new CombinedExplorerAdapter()