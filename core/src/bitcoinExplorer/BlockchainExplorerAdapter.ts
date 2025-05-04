import { GeneralExplorerAdapter } from '../bitcoinExplorer/GeneralExplorerAdapter.ts'
import { Transaction } from './Transaction.ts'
import { Transactions } from './Transactions.ts'
import { type UTXO, sortUTXOs } from './UTXO.ts'

export class BlockchainExplorerAdapter extends GeneralExplorerAdapter {
	private readonly baseUrl: string = 'https://blockchain.info'

	public override async getTransactionsOfAddress(address: string): Promise<Transactions> {
		const query: string = `${this.baseUrl}/rawaddr/${address}`
		const response: Response = await fetch(query)
		if (!response.ok) {
			throw new Error(`BlockchainExplorerAdapter::getInputsOfAddress(${address}) failed: ${response.status}, ${await (await response.blob()).text()}`)
		}
		const json: any = await response.json()
		return {
			n_tx: json.n_tx,
			txs: json.txs.map(Transaction.fromBlockchainTransaction)
		}
	}

	public override async getUtxosOfAddress(address: string): Promise<UTXO[]> {
		const query: string = `${this.baseUrl}/unspent?active=${address}`
		const response: Response = await fetch(query)
		if (!response.ok) {
			throw new Error(`BlockchainExplorerAdapter::getUtxosOfAddress(${address}) failed: ${response.status}, ${await (await response.blob()).text()}`)
		}
		const json: any = await response.json()
		return sortUTXOs((json.unspent_outputs as any[]).map(utxo => ({
			txid: utxo.tx_hash_big_endian,
			vout: utxo.tx_output_n,
			value: utxo.value,
			status: {
				block_height: -utxo.confirmations // TODO: leads to correct sorting, nevertheless fetch correct block_height
			}
		})))
	}
}