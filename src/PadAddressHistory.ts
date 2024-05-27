export class PadAddressHistory {
	private readonly claim: Change & {data: PadAddressData}
	private readonly changes: Change[] = []

	public constructor(claimerAddress: string) {
		this.claim = {data: {owner: claimerAddress}}
	}

	public addChange(change: Change): void {
		this.changes.push(change)
	}

	public getData(): PadAddressData {
		let data: PadAddressData = this.claim.data
		for (const change of this.changes) {
			data = {...data, ...change}
		}
		return data
	}
}

export type Change = {
	//blockNumber: number
	//transaction: string
	data: Partial<PadAddressData>
}

export type PadAddressData = {
	owner: string
	linkTo?: string
	website?: string
	lightningAddress?: string
}