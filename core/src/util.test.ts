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

Deno.test('generateBech32AddressWithPad', () => {
	assertEquals(util.generateBech32AddressWithPad('q'), 'bc1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9e75rs')
	assertEquals(util.generateBech32AddressWithPad('3'), 'bc1q33333333333333333333333333333333jdhc4c')
	assertEquals(util.generateBech32AddressWithPad('l'), 'bc1qllllllllllllllllllllllllllllllllfglmy6')
	assertEquals(util.generateBech32AddressWithPad('test'), 'bc1qtesttesttesttesttesttesttesttestaylauu')
	assertEquals(util.generateBech32AddressWithPad('w508d6qejxtdg4y5r3zarvary0c5xw7k'), 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')
	assertEquals(util.generateBech32AddressWithPad('w508d6qejxtdg4y5r3zarvary0c5xw7ktest'), 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')
	assertEquals(util.generateBech32AddressWithPad('w508d6qejxtdg4y5r3zarvary0c5xw7kkv8f3t4'), 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')
})

Deno.test('addPrefixAndChecksumToBech32Ascii', () => {
	assertEquals(util.addPrefixAndChecksumToBech32Ascii('q'), 'bc1qqsa7s0f')
	assertEquals(util.addPrefixAndChecksumToBech32Ascii('3'), 'bc1q3c2za8g')
	assertEquals(util.addPrefixAndChecksumToBech32Ascii('l'), 'bc1ql63959z')
	assertEquals(util.addPrefixAndChecksumToBech32Ascii('q3l'), 'bc1qq3lzgp3c2')
	assertEquals(util.addPrefixAndChecksumToBech32Ascii('test'), 'bc1qtestrrmw67')
	assertEquals(util.addPrefixAndChecksumToBech32Ascii('w508d6qejxtdg4y5r3zarvary0c5xw7k'), 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')
})

Deno.test('addPrefixAndChecksumToBech32Hex', () => {
	assertEquals(util.addPrefixAndChecksumToBech32Hex('0e140f070d1a001912060b0d081504140311021d030c1d03040f1814060e1e16'), 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')
	assertEquals(util.addPrefixAndChecksumToBech32Hex('0'), 'bc1qqsa7s0f')
	assertEquals(util.addPrefixAndChecksumToBech32Hex('00'), 'bc1qqsa7s0f')
	assertEquals(util.addPrefixAndChecksumToBech32Hex('11'), 'bc1q3c2za8g')
	assertEquals(util.addPrefixAndChecksumToBech32Hex('1f'), 'bc1ql63959z')
	assertEquals(util.addPrefixAndChecksumToBech32Hex('0b19100b'), 'bc1qtestrrmw67')
	assertEquals(util.addPrefixAndChecksumToBech32Hex('00111f'), 'bc1qq3lzgp3c2')
})

Deno.test('bytesToHex', () => {
	assertEquals(util.bytesToHex(new Uint8Array([0])), '00')
	assertEquals(util.bytesToHex(new Uint8Array([0, 0])), '0000')
	assertEquals(util.bytesToHex(new Uint8Array([15])), '0f')
	assertEquals(util.bytesToHex(new Uint8Array([16])), '10')
	assertEquals(util.bytesToHex(new Uint8Array([32])), '20')
	assertEquals(util.bytesToHex(new Uint8Array([240])), 'f0')
	assertEquals(util.bytesToHex(new Uint8Array([241])), 'f1')
	assertEquals(util.bytesToHex(new Uint8Array([255])), 'ff')
	assertEquals(util.bytesToHex(new Uint8Array([255, 8])), 'ff08')
})

Deno.test('hexToBytes', () => {
	assertEquals(util.hexToBytes('00'), new Uint8Array([0]))
	assertEquals(util.hexToBytes('0000'), new Uint8Array([0, 0]))
	assertEquals(util.hexToBytes('0f'), new Uint8Array([15]))
	assertEquals(util.hexToBytes('10'), new Uint8Array([16]))
	assertEquals(util.hexToBytes('20'), new Uint8Array([32]))
	assertEquals(util.hexToBytes('f0'), new Uint8Array([240]))
	assertEquals(util.hexToBytes('f1'), new Uint8Array([241]))
	assertEquals(util.hexToBytes('ff'), new Uint8Array([255]))
	assertEquals(util.hexToBytes('ff08'), new Uint8Array([255, 8]))
})
