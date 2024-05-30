import { PadAddressHistory } from './PadAddressHistory.ts'
import { assertEquals } from './testUtil.test.ts'

Deno.test('addChangeFromOpReturnScript', () => {
	const padAddress = new PadAddressHistory('test', 'testClaimer')
	assertEquals(padAddress.getData(), {owner: 'testClaimer'})

	padAddress.addChangeFromOpReturnScript("test.website='old'")
	assertEquals(padAddress.getData(), {owner: 'testClaimer', website: 'old'})

	padAddress.addChangeFromOpReturnScript("notTest.website='otherWebsite'")
	assertEquals(padAddress.getData(), {owner: 'testClaimer', website: 'old'})

	padAddress.addChangeFromOpReturnScript("test.website='https://bitcoin.org';test.owner='testRecipient'")
	assertEquals(padAddress.getData(), {owner: 'testRecipient', website: 'https://bitcoin.org'})
})