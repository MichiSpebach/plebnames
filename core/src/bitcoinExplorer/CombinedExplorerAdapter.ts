import { BlockchainExplorerAdapter } from './BlockchainExplorerAdapter.ts'
import { BlockstreamExplorerAdapter } from './BlockstreamExplorerAdapter.ts'
import { BtcscanExplorerAdapter } from './BtcscanExplorerAdapter.ts'
import { MempoolExplorerAdapter } from './MempoolExplorerAdapter.ts'
import { InputPrevout } from './Transaction.ts'
import { ExplorerAdapter } from './explorerAdapter.ts'

/** rotates between different Explorers to distribute the load and prevent http 429 (too many requests) */
export class CombinedExplorerAdapter implements ExplorerAdapter {

	private readonly explorers: ExplorerAdapter[] = [
		new MempoolExplorerAdapter(),
		new BlockchainExplorerAdapter(),
		new BtcscanExplorerAdapter(),
		new BlockstreamExplorerAdapter()
	]

	private index: number = -1

	public getFirstInputOfAddress(address: string): Promise<InputPrevout|undefined> {
		return this.selectExplorer().getFirstInputOfAddress(address)
	}
	
	public getInputsOfAddress(address: string): Promise<InputPrevout[]> {
		return this.selectExplorer().getInputsOfAddress(address)
	}

	public getOpReturnOutScriptsOfAddress(address: string): Promise<string[]> {
		return this.selectExplorer().getOpReturnOutScriptsOfAddress(address)
	}
	
	private selectExplorer(): ExplorerAdapter {
		this.index = (this.index+1) % this.explorers.length
		return this.explorers[this.index]
	}
}