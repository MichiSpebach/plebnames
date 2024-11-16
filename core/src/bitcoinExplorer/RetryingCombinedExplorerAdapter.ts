import { CombinedExplorerAdapter } from './CombinedExplorerAdapter.ts'
import type { ExplorerAdapter } from './explorerAdapter.ts'
import type { InputPrevout } from './Transaction.ts'
import type { Transactions } from './Transactions.ts'
import type { UTXO } from './UTXO.ts'

export class RetryingCombinedExplorerAdapter implements ExplorerAdapter {

	private readonly combinedExplorer: ExplorerAdapter = new CombinedExplorerAdapter()

	public getFirstInputOfAddress(address: string): Promise<InputPrevout|undefined> {
		return this.callWithRetry('getFirstInputOfAddress', address)
	}

	public getInputsOfAddress(address: string): Promise<InputPrevout[]> {
		return this.callWithRetry('getInputsOfAddress', address)
	}

	public getOpReturnScriptsOfAddress(address: string): Promise<string[]> {
		return this.callWithRetry('getOpReturnScriptsOfAddress', address)
	}

	public getTransactionsOfAddress(address: string): Promise<Transactions> {
		return this.callWithRetry('getTransactionsOfAddress', address)
	}

	public getUtxosOfAddress(address: string): Promise<UTXO[]> {
		return this.callWithRetry('getUtxosOfAddress', address)
	}

	private async callWithRetry<T extends keyof CombinedExplorerAdapter>(method: T, address: string): Promise<Awaited<ReturnType<CombinedExplorerAdapter[T]>>> {
		try {
			return await (this.combinedExplorer[method](address) as ReturnType<CombinedExplorerAdapter[T]>)
		} catch (error: unknown) {
			console.log(error, 'retrying...')
			return await (this.combinedExplorer[method](address) as ReturnType<CombinedExplorerAdapter[T]>)
		}
	}
}