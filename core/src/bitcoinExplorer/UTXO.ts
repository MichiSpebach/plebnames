
export type UTXO = {
	txid: string
	vout: number
	value: number
	status: {
		block_height: number
	}
}

export function sortUTXOs(utxos: UTXO[]): UTXO[] {
	return utxos.sort((a: UTXO, b: UTXO) => {
		if (a.status.block_height === b.status.block_height) {
			return a.txid < b.txid ? -1 : 1
		}
		return a.status.block_height - b.status.block_height
	})
}