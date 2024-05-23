import { assertEquals } from './testUtil.test.ts'
import { explorerAdapter } from './explorerAdapter.ts'

Deno.test('getFirstInputOfAddress', async () => {
	const firstInput: {addr: string}|undefined = await explorerAdapter.getFirstInputOfAddress('bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy')
	assertEquals(firstInput!.addr, 'bc1qrytsje22pv0z4vgdnexcp0ulp8v9eakfkmw7ve')
})

Deno.test('getInputsOfAddress', async () => {
	const inputs: {addr: string}[] = await explorerAdapter.getInputsOfAddress('bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy')
	assertEquals(inputs.map(input => input.addr), [
		"bc1q8r5xfycn0fjs0tn70pffdgm83m326usetv34tg",
		"bc1qmwhgqgusja6xauvg58lkxapu7tues6a5p2w0xs",
		"bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy",
		"bc1qs6y688m93my6xgn409h0ma3gu82qpypwtyynp6",
		"bc1qrytsje22pv0z4vgdnexcp0ulp8v9eakfkmw7ve"
	])
})

Deno.test('getOutScriptsOfAddress Base58 P2PKH', async () => {
	const scripts: string[] = await explorerAdapter.getOutScriptsOfAddress('192e7Pvewb28wk8hzncuqVXCKyhGZmfTG2')
	assertEquals(scripts, ['EW Merry Christmas !!!'])
})

Deno.test('getOutScriptsOfAddress Bech32', async () => {
	const scripts: string[] = await explorerAdapter.getOutScriptsOfAddress('bc1ppsud9lykgdce3rxsfganq33efnfj6mgmujpt0n3wqg5ymsldnuvsylxqxy')
	assertEquals(scripts, ['EW Running bitcoin'])
})