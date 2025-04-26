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

Deno.test('getOpReturnScriptsOfAddress', async () => {
	const explorer = new GeneralExplorerAdapterForTest([
		new Transaction('txid', [{prevout: {scriptpubkey: '', scriptpubkey_address: 'test'}}], [{scriptpubkey: '6a4a746573742e6e6f7374723d6e707562317063717a3079357a743663666166617a63753668327666397472676873687868647779706d3067386a66326e6d75686d64367271646364383275'}], {block_height: 21}),
		new Transaction('txid', [{prevout: {scriptpubkey: '', scriptpubkey_address: 'test'}}], [{scriptpubkey: '6a4c4f706c65626e616d65732e6e6f7374723d6e707562317063717a3079357a743663666166617a63753668327666397472676873687868647779706d3067386a66326e6d75686d64367271646364383275'}], {block_height: 21})
	])
	assertEquals(await explorer.getOpReturnScriptsOfAddress('test'), [
		'test.nostr=npub1pcqz0y5zt6cfafazcu6h2vf9trghshxhdwypm0g8jf2nmuhmd6rqdcd82u',
		'plebnames.nostr=npub1pcqz0y5zt6cfafazcu6h2vf9trghshxhdwypm0g8jf2nmuhmd6rqdcd82u'
	])
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