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
		const json: any = await response.json() // TODO validate use e.g. Zod
		return {
			n_tx: json.length,
			txs: json.map(BlockstreamExplorerAdapter.blockstreamTransactionToTransaction)
		}
	}

	private static blockstreamTransactionToTransaction(blockstreamTransaction: any): Transaction {
		return {
			inputs: blockstreamTransaction.vin.map((input: any) => {
				return {
					prev_out: {addr: input.prevout.scriptpubkey_address}
				}
			}),
			out: blockstreamTransaction.vout.map((output: any) => {
				return {script: output.scriptpubkey}
			})
		}
	}

}