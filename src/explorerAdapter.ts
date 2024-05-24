import { BlockchainExplorerAdapter } from './BlockchainExplorerAdapter.ts'

export interface ExplorerAdapter {
	getFirstInputOfAddress(address: string): Promise<{addr: string}|undefined>
	getInputsOfAddress(address: string): Promise<{addr: string}[]>
	getOutScriptsOfAddress(address: string): Promise<string[]>
}

export const explorerAdapter: ExplorerAdapter = new BlockchainExplorerAdapter()