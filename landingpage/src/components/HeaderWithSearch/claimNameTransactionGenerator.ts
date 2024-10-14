import { /*Transaction,*/ Psbt } from 'bitcoinjs-lib'
import { util } from 'plebnames'

export function generateClaimNameTransaction(name: string): {toHex: () => string} {
	const plebAddress: string = util.generateBech32AddressWithPad(util.normalizeAsciiToBech32(name))

	//const transaction = new Transaction()
	//transaction.addInput(util.hexToBytes('TODO'), 0) // TODO: input needs to be already added to be able to import transaction into wallet
	//transaction.addOutput(util.hexToBytes(util.asciiToHex(plebAddress)), BigInt(546))
	const transaction = new Psbt()
	//transaction.addInput({hash: 'TODO', index: 0}) // TODO: input needs to be already added to be able to import transaction into wallet
	transaction.addOutput({
		address: plebAddress,
		value: BigInt(546)
	})
	return transaction
}