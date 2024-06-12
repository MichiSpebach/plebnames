import { ExplorerAdapter } from './explorerAdapter.ts'
import { Transaction } from './Transaction.ts'
import { Transactions } from './Transactions.ts'
import * as util from './util.ts'

export abstract class GeneralExplorerAdapter implements ExplorerAdapter {

	public async getFirstInputOfAddress(address: string): Promise<{addr: string}|undefined> {
		const transactions: Transactions = await this.getTransactionsOfAddress(address)
		if (transactions.txs.length < 1) {
			//throw new Error(`BlockchainExplorerAdapter::getFirstInputOfAddress(${address}) failed: no transaction found for address.`)
			return undefined
		}
		if (transactions.n_tx > transactions.txs.length) {
			throw new Error(`BlockchainExplorerAdapter::getFirstInputOfAddress(${address}) failed: case for transactions.n_tx > transactions.txs.length not implemented yet.`)
		}
		const firstTransaction: Transaction = transactions.txs[transactions.txs.length-1]
		if (firstTransaction.inputs.length < 1) {
			throw new Error(`BlockchainExplorerAdapter::getFirstInputOfAddress(${address}) failed: firstTransaction.inputs is empty.`)
		}
		return firstTransaction.inputs[firstTransaction.inputs.length-1].prev_out // length-1 selects the latest address the sender worked with when multiple inputs
	}
	
	public async getInputsOfAddress(address: string): Promise<{addr: string}[]> {
		const transactions: Transactions = await this.getTransactionsOfAddress(address)
		const transactionsInputs: {prev_out: {addr: string}}[] = transactions.txs.flatMap(transaction => transaction.inputs)
		const transactionsInputsPrevs: {addr: string}[] = transactionsInputs.map(input => input.prev_out)
		for (const input of transactionsInputsPrevs) {
			if (!input.addr || typeof input.addr !== 'string') {
				throw new Error(`BlockchainExplorerAdapter::getInputsOfAddress(${address}) failed: input.addr is ${input.addr}`)
			}
		}
		return transactionsInputsPrevs
	}

	public async getOutScriptsOfAddress(address: string): Promise<string[]> {
		const transactions: Transactions = await this.getTransactionsOfAddress(address)
		const authoredTransactions: Transaction[] = transactions.txs.filter(transaction => transaction.inputs.find(input => input.prev_out.addr === address))
		const outputs: {script: string}[] = authoredTransactions.flatMap(transaction => transaction.out)
		return outputs.map(output => output.script)
			.filter(script => script.startsWith('6a12') || script.startsWith('6a16'))
			.map(script => util.hexToAscii(script.substring(4)))
	}

	protected abstract getTransactionsOfAddress(address: string): Promise<Transactions>
}