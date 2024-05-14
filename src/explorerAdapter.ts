import { Transaction } from './Transaction.ts'
import { Transactions } from './Transactions.ts'
import * as util from './util.ts'

interface ExplorerAdapter {
	getFirstInputOfAddress(address: string): Promise<{addr: string}>
	getInputsOfAddress(address: string): Promise<{addr: string}[]>
	getOutScriptsOfAddress(address: string): Promise<string[]>
}

class BlockchainExplorerAdapter implements ExplorerAdapter {
	private readonly baseUrl: string = 'https://blockchain.info'

	public async getFirstInputOfAddress(address: string): Promise<{addr: string}> {
		const transactions: Transactions = await this.getTransactionsOfAddress(address)
		if (transactions.txs.length < 1) {
			throw new Error(`BlockchainExplorerAdapter::getFirstInputOfAddress(${address}) failed: no transaction found for address.`)
		}
		if (transactions.n_tx > transactions.txs.length) {
			throw new Error(`BlockchainExplorerAdapter::getFirstInputOfAddress(${address}) failed: case for transactions.n_tx > transactions.txs.length not implemented yet.`)
		}
		const firstTransaction: Transaction = transactions.txs[transactions.txs.length-1]
		if (firstTransaction.inputs.length !== 1) {
			throw new Error(`BlockchainExplorerAdapter::getFirstInputOfAddress(${address}) failed: expected exactly one input for firstTransaction, but are ${firstTransaction.inputs.length}.`)
		}
		return firstTransaction.inputs[0].prev_out
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
		const outputs = transactions.txs.flatMap(transaction => transaction.out)
		return outputs.map(output => output.script).filter(script => script.startsWith('6a16')).map(script => util.hexToAscii(script.substring(4)))
	}

	private async getTransactionsOfAddress(address: string): Promise<Transactions> {
		let query: string = `${this.baseUrl}/rawaddr/${address}`
		const response: Response = await fetch(query)
		if (!response.ok) {
			throw new Error(`BlockchainExplorerAdapter::getInputsOfAddress(${address}) failed: ${response.status}, ${(await response.blob()).text}`)
		}
		return await response.json() // TODO validate use e.g. Zod
	}
}

export const explorerAdapter: ExplorerAdapter = new BlockchainExplorerAdapter()