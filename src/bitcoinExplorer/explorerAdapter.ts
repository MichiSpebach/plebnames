import { CombinedExplorerAdapter } from './CombinedExplorerAdapter.ts'

export interface ExplorerAdapter {
	getFirstInputOfAddress(address: string): Promise<{scriptpubkey_address: string}|undefined>
	getInputsOfAddress(address: string): Promise<{scriptpubkey_address: string}[]>
	getOpReturnOutScriptsOfAddress(address: string): Promise<string[]>
}

export const explorerAdapter: ExplorerAdapter = new CombinedExplorerAdapter()