import * as util from './util.ts'

export class PadAddressHistory {
	private readonly name: string
	private readonly claim: Change & {data: PadAddressData}
	private readonly changes: Change[] = []
	private data: PadAddressData

	public constructor(name: string, claimerAddress: string) {
		this.name = name
		this.claim = {data: {owner: claimerAddress}}
		this.data = this.claim.data
	}

	public addChangeFromOpReturnScript(opReturnScript: string): void {
		const change: Change = {data: {}}
		for (const instruction of opReturnScript.split(';')) {
			const [name, keyAndValue]: string[] = this.splitStringIntoTwoParts(instruction, '.')
			if (util.normalizeAsciiToBech32(name) !== util.normalizeAsciiToBech32(this.name)) {
				continue
			}
			const [key, value]: string[] = this.splitStringIntoTwoParts(keyAndValue, '=')
			change.data[key as keyof Partial<PadAddressData>] = value.replaceAll("'", '')
		}
		if (Object.entries(change.data).length > 0) {
			this.addChange(change)
		}
	}

	/** 'test.website=bitcoin.org'.split('.', 2) would result in ['test', 'website=bitcoin'] ('.org' would be missing) */
	private splitStringIntoTwoParts(text: string, separator: string): string[] {
		const index: number = text.indexOf(separator)
		return [text.substring(0, index), text.substring(index+1)]
	}

	public addChange(change: Change): void {
		this.changes.push(change)
		this.data = {...this.data, ...change.data}
	}

	public getChanges(): Change[] {
		return this.changes
	}

	public getData(): PadAddressData {
		return this.data
	}
}

export type Change = {
	//blockNumber: number // TODO: important to prevent cycles
	//transaction: string
	data: Partial<PadAddressData>
}

export type PadAddressData = {
	owner: string
	linkTo?: string
	website?: string
	lightningAddress?: string
}