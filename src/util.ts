import base58 from 'npm:bs58'
import base58check from 'npm:bs58check'
import bech32 from 'npm:bech32'

export const base58Chars: string[] = [
	'1','2','3','4','5','6','7','8','9',
	'A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z',
	'a','b','c','d','e','f','g','h','i','j','k','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
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

/** Problem with base 58: there are different procedures that produce slightly different (but valid) addresses and it is not obvious which is evident */
export function generateBase58AddressWithPad(pad: string): string {
	const withChecksumPlaceholders: string = fillUp21BytesWithPadThenAddZeroBytesToJustReach25Bytes(pad)
	//const withChecksumPlaceholders: string = fillUp21BytesWithPadThenFillUp25BytesWithZeroBytes(pad)
	//const withChecksumPlaceholders: string = repeatPadUntilValidBase58Address(pad)
	//const withChecksumPlaceholders: string = fillUp21BytesWithPadThenFillUp25BytesWith255Bytes(pad)

	const bytesWithChecksumPlaceholders: Uint8Array = base58ToBytes(withChecksumPlaceholders)
	const bytesWithoutChecksum: Uint8Array = bytesWithChecksumPlaceholders.slice(0, -4)
	return base58check.encode(bytesWithoutChecksum)
}

function fillUp21BytesWithPadThenFillUp25BytesWithZeroBytes(pad: string): string {
	const withoutChecksum: string = elongateBase58('1', pad, 21)
	const withChecksumPlaceholders: string = elongateBase58(withoutChecksum, hexToBase58(bytesToHex(new Uint8Array([0, 0, 0, 0, 0]))), 25)
	return withChecksumPlaceholders
}

function fillUp21BytesWithPadThenFillUp25BytesWith255Bytes(pad: string): string {
	const withoutChecksum: string = elongateBase58('1', pad, 21)
	let withChecksumPlaceholders: string = elongateBase58(withoutChecksum, hexToBase58(bytesToHex(new Uint8Array([255, 255, 255]))), 25)
	if (base58ToBytes(withChecksumPlaceholders).length < 25) {
		withChecksumPlaceholders = elongateBase58(withoutChecksum, hexToBase58(bytesToHex(new Uint8Array([255, 255, 255, 255]))), 25)
	}
	return withChecksumPlaceholders
}

function fillUp21BytesWithPadThenAddZeroBytesToJustReach25Bytes(pad: string): string {
	const withoutChecksum: string = elongateBase58('1', pad, 21)
	let withChecksumPlaceholders: string
	if (base58ToBytes(withoutChecksum + hexToBase58(bytesToHex(new Uint8Array([0, 0, 0, 0])))).length < 25) {
		if (base58ToBytes(withoutChecksum + hexToBase58(bytesToHex(new Uint8Array([0, 0, 0, 0, 0])))).length < 25) {
			withChecksumPlaceholders = withoutChecksum + hexToBase58(bytesToHex(new Uint8Array([0, 0, 0, 0, 0, 0])))
		} else {
			withChecksumPlaceholders = withoutChecksum + hexToBase58(bytesToHex(new Uint8Array([0, 0, 0, 0, 0])))
		}
	} else {
		withChecksumPlaceholders = withoutChecksum + hexToBase58(bytesToHex(new Uint8Array([0, 0, 0, 0])))
	}
	return withChecksumPlaceholders
}

function repeatPadUntilValidBase58Address(pad: string): string {
	let address: string = ''
	for (let i = 0; base58.decode(address).length < 25; i++) {
		address = '1'+''.padEnd(i, pad)+hexToBase58(bytesToHex(new Uint8Array([0, 0, 0, 0])))
	}
	return address
}

function elongateBase58(base58String: string, pad: string, byteLengthToFill: number): string {
	/*let length: number = 42
	for (; base58.decode(base58String.padEnd(length, pad)).length > 21; length--) {}
	const text: string = base58String.padEnd(length, pad)*/
	let text: string = base58String
	for (let i = 0; ; i++) {
		const newText: string = base58String.padEnd(i, pad)
		if (base58.decode(newText).length > byteLengthToFill) {
			break
		}
		text = newText
	}
	return text
}

/** Problem with base 58: there are different procedures that produce slightly different (but valid) addresses and it is not obvious which is evident */
export function appendChecksumToBase58(base58String: string): string {
	//const base58WithChecksumPlaceholders = elongateBase58(base58String, '1', 25)
	//const base58WithChecksumPlaceholders = elongateBase58(base58String, 'A', 25)
	//const base58WithChecksumPlaceholders = elongateBase58(base58String, 'X', 25)
	//const base58WithChecksumPlaceholders = elongateBase58(base58String, 'a', 25)
	const base58WithChecksumPlaceholders = elongateBase58(base58String, 'x', 25)
	//const base58WithChecksumPlaceholders = elongateBase58(base58String, 'z', 25)

	const bytes: Uint8Array = base58ToBytes(base58WithChecksumPlaceholders)
	const base58Address: string = base58check.encode(bytes.slice(0, -4))
	base58check.decode(base58Address) // throws error if invalid
	return base58Address
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

export function base58BytesToHex(base58Bytes: Uint8Array): string {
	let bytesAsNumber: bigint = BigInt('0x'+bytesToHex(base58Bytes))
	let hex: string = ''
	while (bytesAsNumber > 0) {
		const remainder: bigint = bytesAsNumber % BigInt(58)
		bytesAsNumber = bytesAsNumber / BigInt(58)
		hex = remainder.toString(16)+hex
	}
	hex = '00'+hex
	return hex
}

export function base58ToHex(base58String: string): string {
	return bytesToHex(base58.decode(base58String))
	//return base58BytesToHex(base58.decode(base58String))
}

export function base58ToBytes(base58String: string): Uint8Array {
	return base58.decode(base58String)
}

export function hexToBase58(hex: string): string {
	return base58.encode(hexToBytes(hex))
}

export function decodeBase58AddressToHex(addressInBase58: string): string {
	//return new TextDecoder().decode(base58check.decode(address))
	return bytesToHex(base58check.decode(addressInBase58))
}

export function decodeBase58Address(addressInBase58: string): Uint8Array {
	return base58check.decode(addressInBase58)
}

export function encodeBase58Address(addressInHex: string): string {
	return base58check.encode(hexToBytes(addressInHex))
}