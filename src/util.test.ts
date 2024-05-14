import { assertEquals } from './testUtil.test.ts'
import * as util from './util.ts'

Deno.test('hexToAscii', () => {
	assertEquals(util.hexToAscii('41'), 'A')
	assertEquals(util.hexToAscii('4142'), 'AB')
	assertEquals(util.hexToAscii('4557204d65727279204368726973746d617320212121'), 'EW Merry Christmas !!!')
	assertEquals(util.hexToAscii('45572052756e6e696e6720626974636f696e'), 'EW Running bitcoin')
})

Deno.test('asciiToHex', () => {
	assertEquals(util.asciiToHex('A'), '41')
	assertEquals(util.asciiToHex('AB'), '4142')
	assertEquals(util.asciiToHex('EW Merry Christmas !!!'), '4557204d65727279204368726973746d617320212121')
	assertEquals(util.asciiToHex('EW Running bitcoin'), '45572052756e6e696e6720626974636f696e')
})