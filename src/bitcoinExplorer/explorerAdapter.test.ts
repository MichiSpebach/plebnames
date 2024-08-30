import { assertEquals } from '../testUtil.test.ts'
import { explorerAdapter } from './explorerAdapter.ts'

Deno.test('getFirstInputOfAddress', async () => {
	const firstInput: {scriptpubkey_address: string}|undefined = await explorerAdapter.getFirstInputOfAddress('bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy')
	assertEquals(firstInput!.scriptpubkey_address, 'bc1qrytsje22pv0z4vgdnexcp0ulp8v9eakfkmw7ve')
})

Deno.test('getInputsOfAddress', async () => {
	const inputs: {scriptpubkey_address: string}[] = await explorerAdapter.getInputsOfAddress('bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy')
	assertEquals(inputs.map(input => input.scriptpubkey_address), [
		"bc1q8r5xfycn0fjs0tn70pffdgm83m326usetv34tg",
		"bc1qmwhgqgusja6xauvg58lkxapu7tues6a5p2w0xs",
		"bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy",
		"bc1qs6y688m93my6xgn409h0ma3gu82qpypwtyynp6",
		"bc1qrytsje22pv0z4vgdnexcp0ulp8v9eakfkmw7ve"
	])
})


Deno.test('getOutScriptsOfAddress Base58 P2PKH', async () => {
	// does only work with BlockchainExplorerAdapter, the others index the address as P2PK and not as P2PKH
	(explorerAdapter as any).index = 0 // so next index will be one, the index of the BlockchainExplorerAdapter
	const scripts: string[] = await explorerAdapter.getOpReturnOutScriptsOfAddress('15imVtqf7BzhbmAr6AA15H51tddchkNHyV')
	assertEquals(scripts, ['EW Merry Christmas !!!'])
})

Deno.test('getOutScriptsOfAddress Base58 P2PKH no authered scripts', async () => {
	const scripts: string[] = await explorerAdapter.getOpReturnOutScriptsOfAddress('192e7Pvewb28wk8hzncuqVXCKyhGZmfTG2')
	assertEquals(scripts, [])
})

Deno.test('getOutScriptsOfAddress Bech32', async () => {
	const scripts: string[] = await explorerAdapter.getOpReturnOutScriptsOfAddress('bc1prxgkx0sj0qev28uukw4pg2x44s5whucgfdrryvtr89wa36c90p2swqtf2d')
	assertEquals(scripts, ['EW Running bitcoin'])
})

Deno.test('getOutScriptsOfAddress Bech32 no authered scripts', async () => {
	const scripts: string[] = await explorerAdapter.getOpReturnOutScriptsOfAddress('bc1ppsud9lykgdce3rxsfganq33efnfj6mgmujpt0n3wqg5ymsldnuvsylxqxy')
	assertEquals(scripts, [])
})