import { assertEquals } from '../testUtil.test.ts';
import { GeneralExplorerAdapter } from './GeneralExplorerAdapter.ts';
import { Transaction } from './Transaction.ts';
import { Transactions } from './Transactions.ts';
import { UTXO } from './UTXO.ts';

Deno.test('getFirstInputOfAddress', async () => {
	const explorer = new GeneralExplorerAdapterForTest([
		new Transaction('abc', [{prevout: {scriptpubkey: '', scriptpubkey_address: 'claimer'}}], [], {block_height: 21})
	])
	assertEquals(await explorer.getFirstInputOfAddress(''), {scriptpubkey: '', scriptpubkey_address: 'claimer'})
})

Deno.test('getFirstInputOfAddress multiple transactions', async () => {
	const explorer = new GeneralExplorerAdapterForTest([
		new Transaction('abc', [{prevout: {scriptpubkey: '', scriptpubkey_address: 'other'}}], [], {block_height: 22}),
		new Transaction('xyz', [{prevout: {scriptpubkey: '', scriptpubkey_address: 'claimer'}}], [], {block_height: 21})
	])
	assertEquals(await explorer.getFirstInputOfAddress(''), {scriptpubkey: '', scriptpubkey_address: 'claimer'})
})

Deno.test('getFirstInputOfAddress multiple transactions in same block, lowest txid first', async () => {
	const explorer = new GeneralExplorerAdapterForTest([
		new Transaction('abc', [{prevout: {scriptpubkey: '', scriptpubkey_address: 'claimer'}}], [], {block_height: 21}),
		new Transaction('xyz', [{prevout: {scriptpubkey: '', scriptpubkey_address: 'other'}}], [], {block_height: 21})
	])
	assertEquals(await explorer.getFirstInputOfAddress(''), {scriptpubkey: '', scriptpubkey_address: 'claimer'})
})

Deno.test('getFirstInputOfAddress multiple transactions in same block, lowest txid last', async () => {
	const explorer = new GeneralExplorerAdapterForTest([
		new Transaction('xyz', [{prevout: {scriptpubkey: '', scriptpubkey_address: 'other'}}], [], {block_height: 21}),
		new Transaction('abc', [{prevout: {scriptpubkey: '', scriptpubkey_address: 'claimer'}}], [], {block_height: 21})
	])
	assertEquals(await explorer.getFirstInputOfAddress(''), {scriptpubkey: '', scriptpubkey_address: 'claimer'})
})

class GeneralExplorerAdapterForTest extends GeneralExplorerAdapter {

	public constructor(
		private transactions: Transaction[]
	) {
		super()
	}

	public override async getTransactionsOfAddress(address: string): Promise<Transactions> {
		return {
			n_tx: this.transactions.length,
			txs: this.transactions
		}
	}

	public override getUtxosOfAddress(address: string): Promise<UTXO[]> {
		throw new Error('Method not implemented.');
	}

}