import { CombinedExplorerAdapter } from './CombinedExplorerAdapter.ts'
import type { ExplorerAdapter } from './explorerAdapter.ts'
import type { InputPrevout } from './Transaction.ts'
import type { Transactions } from './Transactions.ts'
import type { UTXO } from './UTXO.ts'

export class RetryingCombinedExplorerAdapter implements ExplorerAdapter {

	private readonly underlyingExplorer: ExplorerAdapter

	private readonly retryCount: number

	public constructor(underlyingExplorer: ExplorerAdapter = new CombinedExplorerAdapter(), retryCount: number = 2) {
		this.underlyingExplorer = underlyingExplorer
		this.retryCount = retryCount
	}

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
		for (let retriesLeft = this.retryCount; retriesLeft > 0; retriesLeft--) {
			try {
				return await (this.underlyingExplorer[method](address) as ReturnType<CombinedExplorerAdapter[T]>)
			} catch (error: unknown) {
				console.log(error, `retrying, ${retriesLeft} left...`)
			}
		}
		return await (this.underlyingExplorer[method](address) as ReturnType<CombinedExplorerAdapter[T]>)
	}
}