import { ExplorerAdapter } from './explorerAdapter.ts'

export class MockExplorerAdapter implements ExplorerAdapter {

	public getFirstInputOfAddress(address: string): Promise<{addr: string}|undefined> {
		if (address === 'bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy') {
			return Promise.resolve({addr: 'bc1qrytsje22pv0z4vgdnexcp0ulp8v9eakfkmw7ve'})
		}
		if (address === 'bc1qa76sspmw6dyx5uem5axxgyawr7ctlzxev2m2ps') {
			return Promise.resolve({addr: 'bc1qa76sspmw6dyx5uem5axxgyawr7ctlzxev2m2ps'})
		}
		if (address === 'bc1qtesttesttesttesttesttesttesttestaylauu') {
			return Promise.resolve({addr: 'bc1qtestcla7mertestcla7mertestcla7men2uhyt'})
		}
		if (address === 'bc1qtesttransfertesttransfertesttranzjda2m') {
			return Promise.resolve({addr: 'bc1qtestcla7mertestcla7mertestcla7men2uhyt'})
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
		if (address === 'bc1qa76sspmw6dyx5uem5axxgyawr7ctlzxev2m2ps') {
			return Promise.resolve([
				{addr: 'bc1qa76sspmw6dyx5uem5axxgyawr7ctlzxev2m2ps'}
			])
		}
		if (address === 'bc1qtesttesttesttesttesttesttesttestaylauu') {
			return Promise.resolve([
				{addr: 'bc1qtestcla7mertestcla7mertestcla7men2uhyt'}
			])
		}
		if (address === 'bc1qtesttransfertesttransfertesttranzjda2m') {
			return Promise.resolve([
				{addr: 'bc1qtestcla7mertestcla7mertestcla7men2uhyt'}
			])
		}
		return Promise.resolve([])
	}

	public getOutScriptsOfAddress(address: string): Promise<string[]> {
		if (address === '15imVtqf7BzhbmAr6AA15H51tddchkNHyV') {
			return Promise.resolve(['EW Merry Christmas !!!'])
		}
		if (address === 'bc1prxgkx0sj0qev28uukw4pg2x44s5whucgfdrryvtr89wa36c90p2swqtf2d') {
			return Promise.resolve(['EW Running bitcoin'])
		}
		if (address === 'bc1qa76sspmw6dyx5uem5axxgyawr7ctlzxev2m2ps') {
			return Promise.resolve(['EW bitcoin'])
		}
		if (address === 'bc1qtestcla7mertestcla7mertestcla7men2uhyt') {
			return Promise.resolve([
				"test.website='old'",
				"test.website='bitcoin.org'",
				"testTransfer.website='old'",
				"testTransfer.website='also old'",
				"testTransfer.owner='bc1qtestrec7p7enttestrec7p7enttestrehs0tm8'",
				"testTransfer.website='already transferred'",
			])
		}
		if (address === 'bc1qtestrec7p7enttestrec7p7enttestrehs0tm8') {
			return Promise.resolve([
				"testTransfer.website='blockstream.com'"
			])
		}
		return Promise.resolve([])
	}

}