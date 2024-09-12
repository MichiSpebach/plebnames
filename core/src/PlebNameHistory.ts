import * as util from './util.ts'

export class PlebNameHistory {
	public readonly name: string
	private readonly claim: PlebNameChange & {data: PlebNameData}
	private readonly changes: PlebNameChange[] = []
	private data: PlebNameData

	public constructor(name: string, claimerAddress: string) {
		this.name = name
		this.claim = {data: {owner: claimerAddress}}
		this.data = this.claim.data
	}

	public addChangeFromOpReturnScript(opReturnScript: string): void {
		const change: PlebNameChange = {data: {}}
		for (const instruction of opReturnScript.split(';')) {
			const [name, keyAndValue]: string[] = this.splitStringIntoTwoParts(instruction, '.')
			if (util.normalizeAsciiToBech32(name) !== util.normalizeAsciiToBech32(this.name)) {
				continue
			}
			const [key, value]: string[] = this.splitStringIntoTwoParts(keyAndValue, '=')
			change.data[key as keyof Partial<PlebNameData>] = value.replaceAll("'", '')
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

	public addChange(change: PlebNameChange): void {
		this.changes.push(change)
		this.data = {...this.data, ...change.data}
	}

	public getChanges(): PlebNameChange[] {
		return this.changes
	}

	public getData(): PlebNameData {
		return this.data
	}
}

export type PlebNameChange = {
	//blockNumber: number // TODO: important to prevent cycles
	//transaction: string
	data: Partial<PlebNameData>
}

export type PlebNameData = {
	owner: string
	linkTo?: string
	nostr?: string
	website?: string
	lightningAddress?: string
}