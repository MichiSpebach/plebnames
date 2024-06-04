import { GeneralExplorerAdapter } from './GeneralExplorerAdapter.ts'
import { Transactions } from './Transactions.ts'

export class BlockchainExplorerAdapter extends GeneralExplorerAdapter {
	private readonly baseUrl: string = 'https://blockchain.info'

	protected async getTransactionsOfAddress(address: string): Promise<Transactions> {
		const query: string = `${this.baseUrl}/rawaddr/${address}`
		const response: Response = await fetch(query)
		if (!response.ok) {
			throw new Error(`BlockchainExplorerAdapter::getInputsOfAddress(${address}) failed: ${response.status}, ${(await response.blob()).text}`)
		}
		return await response.json() // TODO validate use e.g. Zod
	}
}