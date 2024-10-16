import { assertEquals, assertObjectMatch } from '../testUtil.test.ts'
import { explorerAdapter } from './explorerAdapter.ts'
import { InputPrevout } from './Transaction.ts'
import { followNameHistory } from "./explorerAdapter.ts";
import { PlebNameHistory } from '../PlebNameHistory.ts'

Deno.test('getFirstInputOfAddress', async () => {
	const firstInput: InputPrevout | undefined = await explorerAdapter.getFirstInputOfAddress('bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy')
	assertEquals(firstInput!.scriptpubkey_address, 'bc1qrytsje22pv0z4vgdnexcp0ulp8v9eakfkmw7ve')
	assertEquals(firstInput!.scriptpubkey, '0014191709654a0b1e2ab10d9e4d80bf9f09d85cf6c9')
})

Deno.test('getInputsOfAddress', async () => {
	const inputs: InputPrevout[] = await explorerAdapter.getInputsOfAddress('bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy')
	assertEquals(inputs.map(input => ({ scriptpubkey_address: input.scriptpubkey_address, scriptpubkey: input.scriptpubkey })), [
		{ scriptpubkey_address: "bc1q8r5xfycn0fjs0tn70pffdgm83m326usetv34tg", scriptpubkey: '001438e86493137a6507ae7e785296a3678ee2ad7219' },
		{ scriptpubkey_address: "bc1qmwhgqgusja6xauvg58lkxapu7tues6a5p2w0xs", scriptpubkey: '0014dbae80239097746ef188a1ff63743cf2f9986bb4' },
		{ scriptpubkey_address: "bc1q9a968mk6hvptkm5rknhqlegqdj9ry2ahfsjssy", scriptpubkey: '00142f4ba3eedabb02bb6e83b4ee0fe5006c8a322bb7' },
		{ scriptpubkey_address: "bc1qs6y688m93my6xgn409h0ma3gu82qpypwtyynp6", scriptpubkey: '00148689a39f658ec9a32275796efdf628e1d400902e' },
		{ scriptpubkey_address: "bc1qrytsje22pv0z4vgdnexcp0ulp8v9eakfkmw7ve", scriptpubkey: '0014191709654a0b1e2ab10d9e4d80bf9f09d85cf6c9' }
	])
})

Deno.test('getOpReturnScriptsOfAddress Base58 P2PKH', async () => {
	// does only work with BlockchainExplorerAdapter, the others index the address as P2PK and not as P2PKH
	(explorerAdapter as any).index = 0 // so next index will be one, the index of the BlockchainExplorerAdapter
	const scripts: string[] = await explorerAdapter.getOpReturnScriptsOfAddress('15imVtqf7BzhbmAr6AA15H51tddchkNHyV')
	assertEquals(scripts, ['EW Merry Christmas !!!'])
})

Deno.test('getOpReturnScriptsOfAddress Base58 P2PKH no authered scripts', async () => {
	const scripts: string[] = await explorerAdapter.getOpReturnScriptsOfAddress('192e7Pvewb28wk8hzncuqVXCKyhGZmfTG2')
	assertEquals(scripts, [])
})

Deno.test('getOpReturnScriptsOfAddress Bech32', async () => {
	const scripts: string[] = await explorerAdapter.getOpReturnScriptsOfAddress('bc1prxgkx0sj0qev28uukw4pg2x44s5whucgfdrryvtr89wa36c90p2swqtf2d')
	assertEquals(scripts, ['EW Running bitcoin'])
})

Deno.test('getOpReturnScriptsOfAddress Bech32 no authered scripts', async () => {
	const scripts: string[] = await explorerAdapter.getOpReturnScriptsOfAddress('bc1ppsud9lykgdce3rxsfganq33efnfj6mgmujpt0n3wqg5ymsldnuvsylxqxy')
	assertEquals(scripts, [])
})

Deno.test('getUtxosOfAddress', async () => {
	const utxos = await explorerAdapter.getUtxosOfAddress('bc1q88758c9etpsvntxncg68ydvhrzh728802aaq7w')
	assertEquals(utxos.map(utxo => ({
		txid: utxo.txid,
		vout: utxo.vout,
		value: utxo.value,
		status: {/*block_height: utxo.status.block_height*/}
	})), [
		{
			txid: '40b307055c5d4128873d403dc0bb2d902c1beb8176530fc1f286a0ae20e7ce72',
			vout: 0,
			value: 100000,
			status: {
				//block_height: 856064
			}
		},
		{
			txid: '683fe2d28f1ef151b2c7285cdce0eaf608034df13d95c9ba01aeb256243a7d77',
			vout: 1,
			value: 49396,
			status: {
				//block_height: 859262
			}
		}
	])
	assertEquals(utxos[0].status.block_height - utxos[1].status.block_height, 856064 - 859262) // TODO: compare block_height above as soon as implemented in BlockchainExplorerAdapter.ts
})

Deno.test('followNameHistory', async () => {
	const result = await followNameHistory('test');
	assertObjectMatch(result as PlebNameHistory, {
		name: "test",
		claim: {
		  data: {
			owner: "bc1q88758c9etpsvntxncg68ydvhrzh728802aaq7w",
		  },
		},
		changes: [
		  {
			data: {
			  nostr: "npub1pcqz0y5zt6cfafazcu6h2vf9trghshxhdwypm0g8jf2nmuhmd6rqdcd82u",
			},
		  },
		  {
			data: {
			  website: "https://bitcoin.org",
			},
		  },
		],
		data: {
		  owner: "bc1q88758c9etpsvntxncg68ydvhrzh728802aaq7w",
		  nostr: "npub1pcqz0y5zt6cfafazcu6h2vf9trghshxhdwypm0g8jf2nmuhmd6rqdcd82u",
		  website: "https://bitcoin.org",
		},
	  })
})
