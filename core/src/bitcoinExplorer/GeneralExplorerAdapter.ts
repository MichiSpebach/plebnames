import { ExplorerAdapter } from './explorerAdapter.ts'
import { Input, InputPrevout, Transaction } from './Transaction.ts'
import { Transactions } from './Transactions.ts'
import * as util from '../util.ts'
import type { UTXO } from './UTXO.ts'

export abstract class GeneralExplorerAdapter implements ExplorerAdapter {

	public async getFirstInputOfAddress(address: string): Promise<InputPrevout|undefined> {
		const firstTransaction: Transaction|undefined = await this.getFirstTransactionOfAddress(address)
		if (!firstTransaction) {
			return undefined
		}
		if (firstTransaction.vin.length < 1) {
			throw new Error(`GeneralExplorerAdapter::getFirstInputOfAddress(${address}) failed: firstTransaction.inputs is empty.`)
		}
		return firstTransaction.vin[firstTransaction.vin.length-1].prevout // length-1 selects the latest address the sender worked with when multiple inputs
	}

	private async getFirstTransactionOfAddress(address: string): Promise<Transaction|undefined> {
		const transactions: Transactions = await this.getTransactionsOfAddress(address)
		if (transactions.txs.length < 1) {
			return undefined
		}
		if (transactions.n_tx > transactions.txs.length) {
			throw new Error(`GeneralExplorerAdapter::getFirstTransactionOfAddress(${address}) failed: case for transactions.n_tx > transactions.txs.length not implemented yet.`)
		}

		let firstTransaction: Transaction = transactions.txs[transactions.txs.length-1]
		for (let i = transactions.txs.length-2; i >= 0; i--) {
			const transaction: Transaction = transactions.txs[i]
			if (transaction.status.block_height < firstTransaction.status.block_height) {
				console.warn(`GeneralExplorerAdapter::getFirstTransactionOfAddress(${address}) transactions not sorted by descending blockHeight.`)
				firstTransaction = transaction
			}
			if (transaction.status.block_height > firstTransaction.status.block_height) {
				break
			}
			if (transaction.txid < firstTransaction.txid) {
				firstTransaction = transaction
			}
		}
		return firstTransaction
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
			.map(script => this.extractAsciiFromOpReturnOutput(script))
	}

	private extractAsciiFromOpReturnOutput(outputInHex: string): string {
		outputInHex = outputInHex.substring(2) // first two bytes are OP_RETURN Opcode
		if (outputInHex.startsWith(util.OpcodesHex.OP_PUSHDATA1)) {
			outputInHex = outputInHex.substring(4) // byte 3&4 are OP_PUSHDATA1 Opcode, byte 5&6 only are the number of bytes following
		} else {
			outputInHex = outputInHex.substring(2) // we suppose that byte 3&4 are OP_PUSHBYTES_1 to OP_PUSHBYTES_75 Opcode
		}
		return util.hexToAscii(outputInHex)
	}

	public abstract getTransactionsOfAddress(address: string): Promise<Transactions>

	public abstract getUtxosOfAddress(address: string): Promise<UTXO[]>
}