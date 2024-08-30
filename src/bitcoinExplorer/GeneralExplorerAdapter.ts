import { ExplorerAdapter } from './explorerAdapter.ts'
import { Transaction } from './Transaction.ts'
import { Transactions } from './Transactions.ts'
import * as util from '../util.ts'

export abstract class GeneralExplorerAdapter implements ExplorerAdapter {

	public async getFirstInputOfAddress(address: string): Promise<{scriptpubkey_address: string}|undefined> {
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
	
	public async getInputsOfAddress(address: string): Promise<{scriptpubkey_address: string}[]> {
		const transactions: Transactions = await this.getTransactionsOfAddress(address)
		const transactionsInputs: {prevout: {scriptpubkey_address: string}}[] = transactions.txs.flatMap(transaction => transaction.vin)
		const transactionsInputsPrevs: {scriptpubkey_address: string}[] = transactionsInputs.map(input => input.prevout)
		for (const input of transactionsInputsPrevs) {
			if (!input.scriptpubkey_address || typeof input.scriptpubkey_address !== 'string') {
				throw new Error(`GeneralExplorerAdapter::getInputsOfAddress(${address}) failed: input.addr is ${input.scriptpubkey_address}`)
			}
		}
		return transactionsInputsPrevs
	}

	public async getOpReturnOutScriptsOfAddress(address: string): Promise<string[]> {
		const transactions: Transactions = await this.getTransactionsOfAddress(address)
		const authoredTransactions: Transaction[] = transactions.txs.filter(transaction => transaction.vin.find(input => input.prevout.scriptpubkey_address === address))
		const outputs: {scriptpubkey: string}[] = authoredTransactions.flatMap(transaction => transaction.vout)
		return outputs.map(output => output.scriptpubkey)
			.filter(script => script.startsWith(util.OpcodesHex.OP_RETURN))
			.map(script => util.hexToAscii(script.substring(4)))
	}

	protected abstract getTransactionsOfAddress(address: string): Promise<Transactions>
}