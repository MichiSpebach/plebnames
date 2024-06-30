
export class Transaction {
	public readonly inputs: {prev_out: {addr: string}}[]
	public readonly out: {script: string}[]

	private constructor(inputs: {prev_out: {addr: string}}[], out: {script: string}[]) {
		this.inputs = inputs
		this.out = out
	}

	/**
	 * TODO validate use e.g. Zod
	 */
	public static fromBlockchainTransaction(blockchainTransaction: any): Transaction {
		Object.setPrototypeOf(blockchainTransaction, Transaction.prototype) // raw object would not have member methods
		return blockchainTransaction
	}

	/**
	 * TODO: the structure of blockstream and mempool seem to be more common and should be the base structure instead of blockchains
	 * TODO validate use e.g. Zod
	 */
	public static fromBlockstreamOrMempoolTransaction(blockstreamTransaction: any): Transaction {
		return new Transaction(
			blockstreamTransaction.vin.map((input: any) => {
				return {
					prev_out: {addr: input.prevout.scriptpubkey_address}
				}
			}),
			blockstreamTransaction.vout.map((output: any) => {
				return {script: output.scriptpubkey}
			})
		)
	}
}