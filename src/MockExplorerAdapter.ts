import { ExplorerAdapter } from './explorerAdapter.ts'

export class MockExplorerAdapter implements ExplorerAdapter {

	public getFirstInputOfAddress(address: string): Promise<{addr: string}|undefined> {
		if (address === 'bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy') {
			return Promise.resolve({addr: 'bc1qrytsje22pv0z4vgdnexcp0ulp8v9eakfkmw7ve'})
		}
		return Promise.resolve(undefined)
	}

	public getInputsOfAddress(address: string): Promise<{addr: string}[]> {
		if (address === 'bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy') {
			return Promise.resolve([
				{addr: 'bc1q8r5xfycn0fjs0tn70pffdgm83m326usetv34tg'},
				{addr: 'bc1qmwhgqgusja6xauvg58lkxapu7tues6a5p2w0xs'},
				{addr: 'bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy'},
				{addr: 'bc1qs6y688m93my6xgn409h0ma3gu82qpypwtyynp6'},
				{addr: 'bc1qrytsje22pv0z4vgdnexcp0ulp8v9eakfkmw7ve'}
			])
		}
		return Promise.resolve([])
	}

	public getOutScriptsOfAddress(address: string): Promise<string[]> {
		if (address === '192e7Pvewb28wk8hzncuqVXCKyhGZmfTG2') {
			return Promise.resolve(['EW Merry Christmas !!!'])
		}
		if (address === 'bc1ppsud9lykgdce3rxsfganq33efnfj6mgmujpt0n3wqg5ymsldnuvsylxqxy') {
			return Promise.resolve(['EW Running bitcoin'])
		}
		throw new Error("Method not implemented.")
	}

}