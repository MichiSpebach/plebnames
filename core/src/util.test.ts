/// <reference lib="deno.ns" />
import { assertThrows } from 'https://deno.land/std@0.224.0/assert/assert_throws.ts'
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

Deno.test('generateBase58AddressWithPad', () => {
	const list: {pad: string, base58Address: string}[] = [
		{pad: '1', base58Address: '1111111111111111111114oLvT2'},
		{pad: '2', base58Address: '12222222222222222222222222224NVoQH'/*'12222222222222222222222222224NVoQH'*/},
		{pad: '3', base58Address: '13333333333333333333333333332HAYms'},
		{pad: '4', base58Address: '1444444444444444444444444443yjfmY5'/*'1444444444444444444444444443yjfmY5'*/},
		{pad: '5', base58Address: '15555555555555555555555555551DJqMk' /*'1555555555555555555555555555A85reP'*/},
		{pad: '6', base58Address: '16666666666666666666666666662FG2iz' /*'166666666666666666666666666685rvAd'*/},
		{pad: '7', base58Address: '1777777777777777777777777776WuUUt' /*'17777777777777777777777777772uvc6o'*/},
		{pad: '8', base58Address: '18888888888888888888888888862QEK2' /*'18888888888888888888888888887X1YG6'*/},
		{pad: '9', base58Address: '1999999999999999999999999998tNvEs' /*'1999999999999999999999999999B2EbMD'*/},
		{pad: 'A', base58Address: '1AAAAAAAAAAAAAAAAAAAAAAAAAAC1jmnc' /*'1AAAAAAAAAAAAAAAAAAAAAAAAAAACfxNa6'*/},
		{pad: 'B', base58Address: '1BBBBBBBBBBBBBBBBBBBBBBBBBB7jmVRM' /*'1BBBBBBBBBBBBBBBBBBBBBBBBBBB7nKd9B'*/},
		{ pad: "A", base58Address: "1AAAAAAAAAAAAAAAAAAAAAAAAAAC1jmnc" },
		{ pad: "B", base58Address: "1BBBBBBBBBBBBBBBBBBBBBBBBBB7jmVRM" },
		{ pad: "C", base58Address: "1CCCCCCCCCCCCCCCCCCCCCCCCCCFB3Z8v" },
		{ pad: "D", base58Address: "1DDDDDDDDDDDDDDDDDDDDDDDDDDE3769o" },
		{ pad: "E", base58Address: "1EEEEEEEEEEEEEEEEEEEEEEEEEEAUBgpM" },
		{ pad: "F", base58Address: "1FFFFFFFFFFFFFFFFFFFFFFFFFFEkHFTY" },
		{ pad: "G", base58Address: "1GGGGGGGGGGGGGGGGGGGGGGGGGGM3ZwXn" },
		{ pad: "H", base58Address: "1HHHHHHHHHHHHHHHHHHHHHHHHHHH2VzJy" },
		{ pad: "J", base58Address: "1JJJJJJJJJJJJJJJJJJJJJJJJJJH3sV8a" },
		{ pad: "K", base58Address: "1KKKKKKKKKKKKKKKKKKKKKKKKKKM8QnT1" },
		{ pad: "L", base58Address: "1LLLLLLLLLLLLLLLLLLLLLLLLLLLJj3gh" },
		{ pad: "M", base58Address: "1MMMMMMMMMMMMMMMMMMMMMMMMMMHe4Lzg" },
		{ pad: "N", base58Address: "1NNNNNNNNNNNNNNNNNNNNNNNNNNHqvkCB" },
		{ pad: "P", base58Address: "1PPPPPPPPPPPPPPPPPPPPPPPPPPPiHPbb" },
		{ pad: "Q", base58Address: "1QQQQQQQQQQQQQQQQQQQQQQQQQQStSa1T" },
		{ pad: "R", base58Address: "1RRRRRRRRRRRRRRRRRRRRRRRRRRNgD7Ec" },
		{ pad: "S", base58Address: "1SSSSSSSSSSSSSSSSSSSSSSSSSSQw9xNE" },
		{ pad: "T", base58Address: "1TTTTTTTTTTTTTTTTTTTTTTTTTTT5Ck7A" },
		{ pad: "U", base58Address: "1UUUUUUUUUUUUUUUUUUUUUUUUUUWa853P" },
		{ pad: "V", base58Address: "1VVVVVVVVVVVVVVVVVVVVVVVVVVQqH15Q" },
		{ pad: "W", base58Address: "1WWWWWWWWWWWWWWWWWWWWWWWWWWXiSA84" },
		{ pad: "X", base58Address: "1XXXXXXXXXXXXXXXXXXXXXXXXXXYd6Aru" },
		{ pad: "Y", base58Address: "1YYYYYYYYYYYYYYYYYYYYYYYYYYXkJXRp" },
		{ pad: "Z", base58Address: "1ZZZZZZZZZZZZZZZZZZZZZZZZZZYBWi3o" },
		{ pad: "a", base58Address: "1aaaaaaaaaaaaaaaaaaaaaaaaaaaHRhdC" },
		{ pad: "b", base58Address: "1bbbbbbbbbbbbbbbbbbbbbbbbbbYtnUzn" },
		{ pad: "c", base58Address: "1ccccccccccccccccccccccccccbTvYvN" },
		{ pad: "d", base58Address: "1dddddddddddddddddddddddddde4deht" },
		{ pad: "e", base58Address: "1eeeeeeeeeeeeeeeeeeeeeeeeeegFU5yb" },
		{ pad: "f", base58Address: "1ffffffffffffffffffffffffffdAHfTc" },
		{ pad: "g", base58Address: "1ggggggggggggggggggggggggggcnth4w" },
		{ pad: "h", base58Address: "1hhhhhhhhhhhhhhhhhhhhhhhhhhnYe3LJ" },
		{ pad: "i", base58Address: "1iiiiiiiiiiiiiiiiiiiiiiiiiikM3yAr" },
		{ pad: "j", base58Address: "1jjjjjjjjjjjjjjjjjjjjjjjjjjhMApn7" },
		{ pad: "k", base58Address: "1kkkkkkkkkkkkkkkkkkkkkkkkkkigsozP" },
		{ pad: "m", base58Address: "1mmmmmmmmmmmmmmmmmmmmmmmmmmorC22R" },
		{ pad: "n", base58Address: "1nnnnnnnnnnnnnnnnnnnnnnnnnnnVWp4y" },
		{ pad: "o", base58Address: "1oooooooooooooooooooooooooookkTnv" },
		{ pad: "p", base58Address: "1ppppppppppppppppppppppppppue6YLc" },
		{ pad: "q", base58Address: "1qqqqqqqqqqqqqqqqqqqqqqqqqqtyoiNR" },
		{ pad: "r", base58Address: "1rrrrrrrrrrrrrrrrrrrrrrrrrrqWwFMM" },
		{ pad: "s", base58Address: "1ssssssssssssssssssssssssssnSTgvS" },
		{ pad: "t", base58Address: "1ttttttttttttttttttttttttttxmSC8e" },
		{ pad: "u", base58Address: "1uuuuuuuuuuuuuuuuuuuuuuuuuuw9kmBR" },
		{ pad: "v", base58Address: "1vvvvvvvvvvvvvvvvvvvvvvvvvvrQ1mfD" },
		{ pad: "w", base58Address: "1wwwwwwwwwwwwwwwwwwwwwwwwwwzii7Rt" },
		{ pad: "x", base58Address: "1xxxxxxxxxxxxxxxxxxxxxxxxxy1kmdGr" },
		{ pad: "y", base58Address: "1yyyyyyyyyyyyyyyyyyyyyyyyyyw1xKGE" },
		{pad: 'z', base58Address: '1zzzzzzzzzzzzzzzzzzzzzzzzzzxcJ9dd'},
		{pad: 'test', base58Address: '1testtesttesttesttesttesttesbeAH8'},
		{pad: 'PMycacnJaSqwwJqjawXBErnLsZ7', base58Address: '1PMycacnJaSqwwJqjawXBErnLsZAkAvzH' /*'1PMycacnJaSqwwJqjawXBErnLsZ74KvVGM'*/},
		{pad: 'PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs', base58Address: '1PMycacnJaSqwwJqjawXBErnLsZAkAvzH' /*'1PMycacnJaSqwwJqjawXBErnLsZ74KvVGM'*/},
	]

	const addressesWith7CharsChecksum: string[] = []
	const actualList: {pad: string, base58Address: string}[] = []
	for (const element of list) {
		const base58Address: string = util.generateBase58AddressWithPad(element.pad)
		const pad: string = base58Address.slice(1, -6)
		if (pad !== ''.padEnd(pad.length, element.pad)) {
			addressesWith7CharsChecksum.push(base58Address)
		}
		actualList.push({pad: element.pad, base58Address: base58Address})
	}

	assertEquals(addressesWith7CharsChecksum, [
		"1444444444444444444444444443yjfmY5",
		"1xxxxxxxxxxxxxxxxxxxxxxxxxy1kmdGr"
	], 'less addressesWith7CharsChecksum would be better')
	for (const element of actualList) {
		assertEquals(util.base58ToBytes(element.base58Address).length, 25)
	}
	//console.log(actualList)
	assertEquals(actualList, list)
})

Deno.test('appendChecksumToBase58', () => {
	assertEquals(util.appendChecksumToBase58('1PMycacnJaSqwwJqjawXBErnLsZ7'), '1PMycacnJaSqwwJqjawXBErnLsZ7v7SV6k')
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

Deno.test('base58ToHex', () => {
	assertEquals(util.base58ToHex('PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs'), 'f54a5851e9372b87810a8e60cdd2e7cfd80b6e31c7f18fe8')
	assertEquals(util.base58ToHex('1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs'), '00f54a5851e9372b87810a8e60cdd2e7cfd80b6e31c7f18fe8')
	assertEquals(util.base58ToHex('1PMycacnJaSqwwJqjawXBErnLsZ7xxxxxx'), '00f54a5851e9372b87810a8e60cdd2e7cfd80b6e368d1d1351')
	assertEquals(util.base58ToHex('1PMycacnJaSqwwJqjawXBErnLsxxxxxxxx'), '00f54a5851e9372b87810a8e60cdd2e7cfd80b9e18da29b711')
	assertEquals(util.base58ToHex('test'), '99c7b3')
	assertEquals(util.base58ToHex('testxxxx'), '67ba227b1031')
	assertEquals(util.base58ToHex('testtest'), '67ba226e39e3')
})

Deno.test('hexToBase58', () => {
	assertEquals(util.hexToBase58('00f54a5851e9372b87810a8e60cdd2e7cfd80b6e31c7f18fe8'), '1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs')
	assertEquals(util.hexToBase58('f54a5851e9372b87810a8e60cdd2e7cfd80b6e31c7f18fe8'), 'PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs')
	assertEquals(util.hexToBase58('00'), '1')
	assertEquals(util.hexToBase58('09'), 'A')
	assertEquals(util.hexToBase58('39'), 'z')
	assertEquals(util.hexToBase58('0000'), '11')
	assertEquals(util.hexToBase58('0909'), 'gt') // %58
	assertEquals(util.hexToBase58('3939'), '5Ma') // %58
	assertEquals(util.hexToBase58('000939'), '1hi') // %58
	assertEquals(util.hexToBase58('99c7b3'), 'test')
})

Deno.test('base58ToBytes', () => {
	assertEquals(util.base58ToBytes('1'), new Uint8Array([0]))
	assertEquals(util.base58ToBytes('A'), new Uint8Array([9]))
	assertEquals(util.base58ToBytes('z'), new Uint8Array([57]))
	assertEquals(util.base58ToBytes('11'), new Uint8Array([0, 0]))
	assertEquals(util.base58ToBytes('AA'), new Uint8Array([2, 19]))
	assertEquals(util.base58ToBytes('zz'), new Uint8Array([13, 35]))
	assertEquals(util.base58ToBytes('111'), new Uint8Array([0, 0, 0]))
	assertEquals(util.base58ToBytes('AAA'), new Uint8Array([120, 87]))
	assertEquals(util.base58ToBytes('zzz'), new Uint8Array([2, 250, 39]))
	assertEquals(util.base58ToBytes('1Az'), new Uint8Array([0, 2, 67]))
	assertEquals(util.bytesToHex(util.base58ToBytes('1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs')), '00f54a5851e9372b87810a8e60cdd2e7cfd80b6e31c7f18fe8')
})

Deno.test('decodeBase58AddressToHex', () => {
	assertEquals(util.decodeBase58AddressToHex('1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs'), '00f54a5851e9372b87810a8e60cdd2e7cfd80b6e31')
	assertThrows(() => {
		assertEquals(util.decodeBase58AddressToHex('1PMycacnJaSqwwJqjawXBErnLsZ7'), '00f54a5851e9372b87810a8e60cdd2e7cfd80b6e31')
	})
})

Deno.test('encodeBase58Address', () => {
	assertEquals(util.encodeBase58Address('00f54a5851e9372b87810a8e60cdd2e7cfd80b6e31'), '1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs')
})