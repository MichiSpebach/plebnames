import { BlockchainExplorerAdapter } from './BlockchainExplorerAdapter.ts'
import { BlockstreamExplorerAdapter } from './BlockstreamExplorerAdapter.ts'
import { BtcscanExplorerAdapter } from './BtcscanExplorerAdapter.ts'
import { MempoolExplorerAdapter } from './MempoolExplorerAdapter.ts'
import { InputPrevout } from './Transaction.ts'
import type { Transactions } from './Transactions.ts'
import type { UTXO } from './UTXO.ts'
import { ExplorerAdapter } from './explorerAdapter.ts'

/** rotates between different Explorers to distribute the load and prevent http 429 (too many requests) */
export class CombinedExplorerAdapter implements ExplorerAdapter {

	private readonly explorers: ExplorerAdapter[] = [
		new MempoolExplorerAdapter(),
		new BlockchainExplorerAdapter(),
		new BtcscanExplorerAdapter(),
		new BlockstreamExplorerAdapter()
	]

	private index: number = 3

	public getFirstInputOfAddress(address: string): Promise<InputPrevout|undefined> {
		return this.selectExplorer().getFirstInputOfAddress(address)
	}
	
	public getInputsOfAddress(address: string): Promise<InputPrevout[]> {
		return this.selectExplorer().getInputsOfAddress(address)
	}
	
	public getOpReturnScriptsOfAddress(address: string): Promise<string[]> {
		return this.selectExplorer().getOpReturnScriptsOfAddress(address)
	}

	public getTransactionsOfAddress(address: string): Promise<Transactions> {
		return this.selectExplorer().getTransactionsOfAddress(address)
	}

	public getUtxosOfAddress(address: string): Promise<UTXO[]> {
		return this.selectExplorer().getUtxosOfAddress(address)
	}
	
	private selectExplorer(): ExplorerAdapter {
		let newIndex: number = Math.floor(Math.random() * (this.explorers.length-1))
		if (newIndex >= this.index) {
			newIndex++
		}
		this.index = newIndex
		return this.explorers[this.index]
	}
}