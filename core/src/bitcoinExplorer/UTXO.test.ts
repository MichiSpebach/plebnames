import { assertEquals } from '../testUtil.test.ts'
import { type UTXO, sortUTXOs } from './UTXO.ts'

Deno.test('sortUTXOs', () => {
	const older: UTXO = createUTXO({status: {block_height: 123456}})
	const newer: UTXO = createUTXO({status: {block_height: 123457}})
	assertEquals(sortUTXOs([older, newer]), [older, newer])
	assertEquals(sortUTXOs([newer, older]), [older, newer])
})

Deno.test('sortUTXOs of same block', () => {
	const lower: UTXO = createUTXO({txid: 'aa', status: {block_height: 123456}})
	const higher: UTXO = createUTXO({txid: 'ab', status: {block_height: 123456}})
	assertEquals(sortUTXOs([lower, higher]), [lower, higher])
	assertEquals(sortUTXOs([higher, lower]), [lower, higher])
})

function createUTXO(options: Partial<UTXO>): UTXO {
	return {
		txid: '0123456789abcdef',
		vout: 0,
		value: 21,
		status: {
			block_height: 123456
		},
		...options
	}
}