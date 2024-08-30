
export class Transaction {
	public readonly vin: {prevout: {scriptpubkey_address: string}}[]
	public readonly vout: {scriptpubkey: string}[]

	private constructor(inputs: {prevout: {scriptpubkey_address: string}}[], outputs: {scriptpubkey: string}[]) {
		this.vin = inputs
		this.vout = outputs
	}

	public static fromBlockstreamOrMempoolTransaction(blockstreamTransaction: any): Transaction {
		const transaction: Transaction = Object.setPrototypeOf(blockstreamTransaction, Transaction.prototype) // raw object would not have member methods
		transaction.validate()
		return transaction
	}

	public static fromBlockchainTransaction(blockchainTransaction: any): Transaction {
		const transaction = new Transaction(
			blockchainTransaction.inputs.map((input: any) => {
				return {
					prevout: {scriptpubkey_address: input.prev_out.addr}
				}
			}),
			blockchainTransaction.out.map((output: any) => {
				return {scriptpubkey: output.script}
			})
		)
		transaction.validate()
		return transaction
	}

	/**
	 * TODO use e.g. Zod
	 */
	private validate(): void {
		for (const input of this.vin) {
			if (typeof input.prevout.scriptpubkey_address !== 'string') {
				console.warn(`typeof input.prevout.scriptpubkey_address !== 'string', input is: ${JSON.stringify(input)}`)
			}
		}
		for (const output of this.vout) {
			if (typeof output.scriptpubkey !== 'string') {
				console.warn(`typeof output.scriptpubkey !== 'string', output is: ${JSON.stringify(output)}`)
			}
		}
	}
}