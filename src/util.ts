
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