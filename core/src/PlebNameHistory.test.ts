import { PlebNameHistory } from './PlebNameHistory.ts'
import { assertEquals } from './testUtil.test.ts'

Deno.test('addChangeFromOpReturnScript', () => {
	const nameHistory = new PlebNameHistory('test', 'testClaimer')
	assertEquals(nameHistory.getData(), {owner: 'testClaimer'})

	nameHistory.addChangeFromOpReturnScript("test.website='old'")
	assertEquals(nameHistory.getData(), {owner: 'testClaimer', website: 'old'})

	nameHistory.addChangeFromOpReturnScript("notTest.website='otherWebsite'")
	assertEquals(nameHistory.getData(), {owner: 'testClaimer', website: 'old'})

	nameHistory.addChangeFromOpReturnScript("test.website='https://bitcoin.org';test.owner='testRecipient'")
	assertEquals(nameHistory.getData(), {owner: 'testRecipient', website: 'https://bitcoin.org'})
})