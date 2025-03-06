# Plebnames: Names on just Bitcoin

### Abstract
With Bitcoin we have free & uncensorable money. With Nostr we have free & uncensorable social networks. We don't have free & uncensorable names yet.\
PlebNames is an idea of a protocol for this missing piece of freedom technology.\
To technically use names as identification they have to be owned by one clear entity and there needs to be a synchronized register to clarify ownership.\
As we want free names that can be really owned this register has also to be uncensorable and decentralized without any elevated roles in it.\
There is only one thing that accomplishes this and is big enough to withstand any attacks: Bitcoin!\
Any requirements for extra infrastructure would compromise on this and make the protocol attackable.\
PlebNames uses normal bech32 addresses to encode names and OP_RETURN scripts to inscribe data. Only normal Bitcoin explorers are required, no other infrastructure.\
This makes PlebNames a simple, ubiquitous, uncensorable and fast Protocol.

### How can a PlebName be claimed
For example "Ego" is a great name, but there is one problem: How to let everbody know that we claimed "Ego" first because it is not indexed.\
Fortunately Bitcoin addresses are indexed by every Bitcoin explorer, then let's convert our name to a Bitcoin address:\
Convert your name to Bech32. As Bech32 is missing some letters let's agree b converts to 8, i to 7 and o to 0.\
So in our example, "Ego" converts to "eg0".
Problem: "eg0" is not a valid Bitcoin address. Luckily there is one very obvious and deterministic way:\
Prefix it with "bc1q" and as you are proud of your name repeat it as long as possible (reach 32 letters), then suffix it with the 6 letter checksum.\
We get "bc1qeg0eg0eg0eg0eg0eg0eg0eg0eg0eg0egt7y40w" (exactly 42=2*21 letters, awesome!) and call it PlebAddress, the PlebAddress of a name is unambiguous, there is exactly one PlebAddress for a name.\
In a Bitcoin explorer of your choice search for your PlebAddress to ensure it is not claimed yet.\
Send or burn the smallest satoshi count to your PlebAddress that is distributed in the mempool and accepted by miners (atm 546 SATs).\
We agree the first one who sent to a PlebAddress claimed the related PlebName.

### How data can be attached to a PlebName
To inscribe data to a name we use JavaScript like syntax in OP_RETURN scripts.\
For example to set the website of the name "PlebNames" to "https://plebnames.org" we send from the ownerAddress "plebnames.website='https://plebnames.org'" encoded as hex. The quotes are optional also the notation of the name does not matter because e.g. "PlebNames" is the same as "ple8names".\
If a field is already set the newer entry counts. So it is possible to update the attached data.

### Edgecases
If a name is claimed by multiple addresses in the same block the claim with the smallest transaction hash counts. This is one of the simplest implementations and every Bitcoin explorer provides the transation hash. 

### Drawbacks
#### Unspendable UTXOs
Yes, claiming a PlebName creates an unspendable UTXO, but taking into account that everybody who uses the Bitcoin mainchain has about 10 to 20 UTXOs on average
one or two additional UTXOs for having one or two names on average do not fall into account and are imho worth it to have convenient names on just Bitcoin.

#### About using the Bitcoin chain only for money
We believe that all important information will be anchored in the Bitcoin chain because it is the most secure, uncensorable and ubiquitous data storage of humanity.
Names are such a thing.
Furthermore PlebNames encourages everyone to use owned Bitcoin wallets because PlebName inscriptions are signed with Bitcoin wallets, just like ordinary Bitcoin transactions.

#### The space on the Bitcoin chain is limited

### Outlook
#### PlebNames can be scaled to second layer names

#### Bitcoin derived data attachments
In general data can be attached from everywhere to the name by just signing the data with the owners Bitcoin address. The attached data is not required to be stored on-chain.

#### Bitcoin derived reputation
PlebNames connects Nostr and Bitcoin.
