import { GeneralExplorerAdapter } from './GeneralExplorerAdapter.ts'
import { Transaction } from './Transaction.ts'
import { Transactions } from './Transactions.ts'

export class BlockstreamExplorerAdapter extends GeneralExplorerAdapter {
	private readonly baseUrl: string = 'https://blockstream.info/api'

	protected async getTransactionsOfAddress(address: string): Promise<Transactions> {
		const query: string = `${this.baseUrl}/address/${address}/txs`
		const response: Response = await fetch(query)
		if (!response.ok) {
			throw new Error(`BlockstreamExplorerAdapter::getTransactionsOfAddress(${address}) failed: ${response.status}, ${(await response.blob()).text}`)
		}
		const json: any = await response.json()
		return {
			n_tx: json.length,
			txs: json.map(Transaction.fromBlockstreamOrMempoolTransaction)
		}
	}

}