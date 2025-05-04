import { bech32 } from 'npm:bech32@2.0.0'

export enum OpcodesHex {
	OP_RETURN = '6a',
	OP_PUSHDATA1 = '4c'
}

export const base58Chars: string[] = [
	'1','2','3','4','5','6','7','8','9',
	'A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z',
	'a','b','c','d','e','f','g','h','i','j','k','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
]

export const bech32Chars: string[] = [
	'q','p','z','r','y','9','x','8','g','f','2','t','v','d','w','0','s','3','j','n','5','4','k','h','c','e','6','m','u','a','7','l'
]

export function hexToAscii(hex: string): string {
	let ascii: string = ''
	for (let i = 0; i < hex.length; i += 2) {
		const charCode: number = Number('0x'+hex.substring(i, i+2))
		ascii += String.fromCharCode(charCode)
	}
	return ascii
}

export function asciiToHex(ascii: string): string {
	let hex: string = ''
	for (let i = 0; i < ascii.length; i++) {
		hex += ascii.charCodeAt(i).toString(16)
	}
	return hex
}

/**
 * @param bech32 e.g. "ple8names"
 * @returns e.g. "Plebnames"
 */
export function normalizeBech32ToCapitalizedAscii(bech32: string): string {
	const normalizedAscii: string = normalizeBech32ToAscii(bech32)
	return normalizedAscii[0].toUpperCase() + normalizedAscii.substring(1)
}

/**
 * @param bech32 e.g. "ple8names"
 * @returns e.g. "plebnames"
 */
export function normalizeBech32ToAscii(bech32: string): string {
	return bech32.replaceAll('8', 'b').replaceAll('7', 'i').replaceAll('0', 'o')
}

/**
 * @param ascii e.g. "Plebnames"
 * @returns e.g. "ple8names"
 */
export function normalizeAsciiToBech32(ascii: string): string {
	let bech32: string = ''
	for (const char of ascii.toLowerCase().replaceAll('b', '8').replaceAll('i', '7').replaceAll('o', '0')) { // TODO: could also replace 'b' with '6'?
		if (bech32Chars.includes(char)) {
			bech32 += char
		}
	}
	return bech32
}

/**
 * @param plebname e.g. "Plebnames"
 * @returns e.g. "bc1qple8namesple8namesple8namesple8nvyw48s"
 */
export function generatePlebAddress(plebname: string): string {
	return generateBech32AddressWithPad(normalizeAsciiToBech32(plebname))
}

/**
 * @param plebname e.g. "ple8names"
 * @returns e.g. "bc1qple8namesple8namesple8namesple8nvyw48s"
 */
export function generateBech32AddressWithPad(pad: string): string {
	return addPrefixAndChecksumToBech32Ascii(''.padEnd(32, pad))
}

export function addPrefixAndChecksumToBech32Ascii(bech32InAscii: string): string {
	const bytes: number[] = []
	for (let i = 0; i < bech32InAscii.length; i++) {
		bytes.push(bech32Chars.indexOf(bech32InAscii[i]))
	}
	return bech32.encode('bc', [0, ...bytes])
}

export function addPrefixAndChecksumToBech32Hex(bech32InHex: string): string {
	const bytes: Uint8Array = hexToBytes(bech32InHex) 
	return bech32.encode('bc', [0, ...bytes])
}

export function bytesToHex(bytes: Uint8Array): string {
	let hex: string = ''
	for (const byte of bytes) {
		if (byte < 16) {
			hex += '0'
		}
		hex += byte.toString(16)
	}
	return hex
}

export function hexToBytes(hex: string): Uint8Array {
	let bytes: Uint8Array = new Uint8Array()
	for (let i = 0; i < hex.length; i += 2) {
		bytes = new Uint8Array([...bytes, Number('0x'+hex.substring(i, i+2))])
	}
	return bytes
}

export function asciiToBytes(ascii: string): Uint8Array {
	return hexToBytes(asciiToHex(ascii))
}