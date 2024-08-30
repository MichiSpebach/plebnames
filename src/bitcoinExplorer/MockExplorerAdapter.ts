import { ExplorerAdapter } from './explorerAdapter.ts'
import { InputPrevout } from './Transaction.ts'

export class MockExplorerAdapter implements ExplorerAdapter {

	public getFirstInputOfAddress(address: string): Promise<InputPrevout|undefined> {
		if (address === 'bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy') {
			return Promise.resolve({scriptpubkey_address: 'bc1qrytsje22pv0z4vgdnexcp0ulp8v9eakfkmw7ve', scriptpubkey: '0014191709654a0b1e2ab10d9e4d80bf9f09d85cf6c9'})
		}
		if (address === 'bc1qa76sspmw6dyx5uem5axxgyawr7ctlzxev2m2ps') {
			return Promise.resolve({scriptpubkey_address: 'bc1qa76sspmw6dyx5uem5axxgyawr7ctlzxev2m2ps', scriptpubkey: '00140014efb508076ed3486a733ba74c6413ae1fb0bf88d9'})
		}
		if (address === 'bc1qtesttesttesttesttesttesttesttestaylauu') {
			return Promise.resolve({scriptpubkey_address: 'bc1qtestcla7mertestcla7mertestcla7men2uhyt', scriptpubkey: '00145e60bc7fbede46bcc178ff7dbc8d7982f1fefb79'})
		}
		if (address === 'bc1qtesttransfertesttransfertesttranzjda2m') {
			return Promise.resolve({scriptpubkey_address: 'bc1qtestcla7mertestcla7mertestcla7men2uhyt', scriptpubkey: '00145e60bc7fbede46bcc178ff7dbc8d7982f1fefb79'})
		}
		return Promise.resolve(undefined)
	}

	public getInputsOfAddress(address: string): Promise<InputPrevout[]> {
		if (address === 'bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy') {
			return Promise.resolve([
				{scriptpubkey_address: 'bc1q8r5xfycn0fjs0tn70pffdgm83m326usetv34tg', scriptpubkey: '001438e86493137a6507ae7e785296a3678ee2ad7219'},
				{scriptpubkey_address: 'bc1qmwhgqgusja6xauvg58lkxapu7tues6a5p2w0xs', scriptpubkey: '0014dbae80239097746ef188a1ff63743cf2f9986bb4'},
				{scriptpubkey_address: 'bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy', scriptpubkey: '00142f4ba3eedabb02bb6e83b4ee0fe5006c8a322bb7'},
				{scriptpubkey_address: 'bc1qs6y688m93my6xgn409h0ma3gu82qpypwtyynp6', scriptpubkey: '00148689a39f658ec9a32275796efdf628e1d400902e'},
				{scriptpubkey_address: 'bc1qrytsje22pv0z4vgdnexcp0ulp8v9eakfkmw7ve', scriptpubkey: '0014191709654a0b1e2ab10d9e4d80bf9f09d85cf6c9'}
			])
		}
		if (address === 'bc1qa76sspmw6dyx5uem5axxgyawr7ctlzxev2m2ps') {
			return Promise.resolve([
				{scriptpubkey_address: 'bc1qa76sspmw6dyx5uem5axxgyawr7ctlzxev2m2ps', scriptpubkey: '0014efb508076ed3486a733ba74c6413ae1fb0bf88d9'}
			])
		}
		if (address === 'bc1qtesttesttesttesttesttesttesttestaylauu') {
			return Promise.resolve([
				{scriptpubkey_address: 'bc1qtestcla7mertestcla7mertestcla7men2uhyt', scriptpubkey: '00145e60bc7fbede46bcc178ff7dbc8d7982f1fefb79'}
			])
		}
		if (address === 'bc1qtesttransfertesttransfertesttranzjda2m') {
			return Promise.resolve([
				{scriptpubkey_address: 'bc1qtestcla7mertestcla7mertestcla7men2uhyt', scriptpubkey: '00145e60bc7fbede46bcc178ff7dbc8d7982f1fefb79'}
			])
		}
		return Promise.resolve([])
	}

	public getOpReturnOutScriptsOfAddress(address: string): Promise<string[]> {
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
				"test.website='https://bitcoin.org'",
				"testTransfer.website='old'",
				"testTransfer.website='also old'",
				"testTransfer.owner='bc1qtestrec7p7enttestrec7p7enttestrehs0tm8'",
				"testTransfer.website='already transferred'",
			])
		}
		if (address === 'bc1qtestrec7p7enttestrec7p7enttestrehs0tm8') {
			return Promise.resolve([
				"testTransfer.website='https://blockstream.com'"
			])
		}
		return Promise.resolve([])
	}

}