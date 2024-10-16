import { GeneralExplorerAdapter } from './GeneralExplorerAdapter.ts'
import { Transaction } from './Transaction.ts'
import { Transactions } from './Transactions.ts'
import { type UTXO, sortUTXOs } from './UTXO.ts'

export class MempoolExplorerAdapter extends GeneralExplorerAdapter {
	private readonly baseUrl: string = 'https://mempool.space/api'

	public override async getTransactionsOfAddress(address: string): Promise<Transactions> {
		const query: string = `${this.baseUrl}/address/${address}/txs`
		const response: Response = await fetch(query)
		if (!response.ok) {
			throw new Error(`MempoolExplorerAdapter::getTransactionsOfAddress(${address}) failed: ${response.status}, ${(await response.blob()).text}`)
		}
		const json: any = await response.json()
		return {
			n_tx: json.length,
			txs: json.map(Transaction.fromBlockstreamOrMempoolTransaction)
		}
	}

	public override async getUtxosOfAddress(address: string): Promise<UTXO[]> {
		const query: string = `${this.baseUrl}/address/${address}/utxo`
		const response: Response = await fetch(query)
		if (!response.ok) {
			throw new Error(`MempoolExplorerAdapter::getUtxosOfAddress(${address}) failed: ${response.status}, ${(await response.blob()).text}`)
		}
		const json: any = await response.json()
		return sortUTXOs(json)
	}

}