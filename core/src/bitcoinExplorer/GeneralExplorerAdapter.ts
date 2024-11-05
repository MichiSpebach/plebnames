import { ExplorerAdapter } from './explorerAdapter.ts'
import { Input, InputPrevout, Transaction } from './Transaction.ts'
import { Transactions } from './Transactions.ts'
import * as util from '../util.ts'
import type { UTXO } from './UTXO.ts'

export abstract class GeneralExplorerAdapter implements ExplorerAdapter {

	public async getFirstInputOfAddress(address: string): Promise<InputPrevout|undefined> {
		const transactions: Transactions = await this.getTransactionsOfAddress(address)
		if (transactions.txs.length < 1) {
			//throw new Error(`GeneralExplorerAdapter::getFirstInputOfAddress(${address}) failed: no transaction found for address.`)
			return undefined
		}
		if (transactions.n_tx > transactions.txs.length) {
			throw new Error(`GeneralExplorerAdapter::getFirstInputOfAddress(${address}) failed: case for transactions.n_tx > transactions.txs.length not implemented yet.`)
		}
		const firstTransaction: Transaction = transactions.txs[transactions.txs.length-1]
		if (firstTransaction.vin.length < 1) {
			throw new Error(`GeneralExplorerAdapter::getFirstInputOfAddress(${address}) failed: firstTransaction.inputs is empty.`)
		}
		return firstTransaction.vin[firstTransaction.vin.length-1].prevout // length-1 selects the latest address the sender worked with when multiple inputs
	}
	
	public async getInputsOfAddress(address: string): Promise<InputPrevout[]> {
		const transactions: Transactions = await this.getTransactionsOfAddress(address)
		const transactionsInputs: Input[] = transactions.txs.flatMap(transaction => transaction.vin)
		return transactionsInputs.map(input => input.prevout)
	}

	public async getOpReturnScriptsOfAddress(address: string): Promise<string[]> {
		const transactions: Transactions = await this.getTransactionsOfAddress(address)
		const authoredTransactions: Transaction[] = transactions.txs.filter(transaction => transaction.vin.find(input => input.prevout.scriptpubkey_address === address))
		const outputs: {scriptpubkey: string}[] = authoredTransactions.flatMap(transaction => transaction.vout)
		return outputs.map(output => output.scriptpubkey)
			.filter(script => script.startsWith(util.OpcodesHex.OP_RETURN))
			.map(script => util.hexToAscii(script.substring(4)))
	}

	public abstract getTransactionsOfAddress(address: string): Promise<Transactions>

	public abstract getUtxosOfAddress(address: string): Promise<UTXO[]>
}