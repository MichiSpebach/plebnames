### About PlebNames
PlebNames are piggybacked names on Bitcoin. Just the Bitcoin chain and normal block explorers are required, no other server infrastructure or sidechain.\
A PlebName is unique and is owned by one clear pleb at a time (or with multisig a group of plebs).\
The owner of a Plebname (the one who claimed the name first) can attach data to it, like a Lightning Address or Nostr npub.\
Try it out at http://plebnames.org.

### Usage of core library
```
npm install plebnames
```
```TypeScript
import { bitcoinExplorer } from 'plebnames'
//import { bitcoinExplorer } from 'jsr:@plebnames/core@0.2.1' // or 'npm:plebnames@0.2.4' for Deno

const nameHistory: PlebNameHistory|'unclaimed' = await bitcoinExplorer.followNameHistory('test')
if (nameHistory === 'unclaimed') {
	console.log('Name is not claimed yet.')
} else {
	console.log(nameHistory.getData())
	// {
	// 	owner: "bc1q88758c9etpsvntxncg68ydvhrzh728802aaq7w",
	// 	nostr: "npub1pcqz0y5zt6cfafazcu6h2vf9trghshxhdwypm0g8jf2nmuhmd6rqdcd82u",
	// 	website: "https://bitcoin.org"
	// }
}
```

### Why PlebNames
PlebNames give every pleb a clear unique name that can be spoken and easily remembered.\
For example when doing a transaction: Instead of typing in a long address you just type in the PlebName of a pleb. The wallet then looks in the Bitcoin mainchain to whom the PlebName belongs and resolves the PlebName to the actual address.

### How can I get my PlebName
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

### What can you do with your PlebName
You can own it, really own it.\
You can publish the most precious information about your name that should be able to be fastly looked-up by everyone. E.g. your current lightningAddress.\
You can update these most precious information and transfer a PlebName to somebody else.

### Why do PlebNames abuse Bitcoin-Addresses?
Bitcoin addresses are indexed by every bitcoin explorer. This makes it very easy to find out when a PlebAddress first occured.\
It enables a very simple code snipped to look-up when a PlebName was first claimed.\
This makes PlebNames a simple, ubiquitous, uncensorable and fast Protocol.

### What about unspendable UTXOs?
Yes, claiming a PlebName creates an unspendable UTXO, but taking into account that everybody who uses the Bitcoin mainchain has about 10 to 20 UTXOs on average\
one or two additional UTXOs for having one or two names on average do not fall into account and are imho worth it to have convenient names on just Bitcoin.

### Develop
#### Prerequisites
Install the JavaScript runtime Deno: https://docs.deno.com/runtime/manual \
When working with VS Code the Deno extension by denoland is recommended: https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno \
To get an overview of the code base try out Mammutmap: https://marketplace.visualstudio.com/items?itemName=mammutmap.mammutmap

#### Start website
```
cd ./landingpage
npm run dev
```

#### Deploy website
The folder `./dist/website/` is delivered via GitHub Pages, see [./.github/workflows/static.yml](./.github/workflows/static.yml).\
To deploy a new version run within `./landingpage` `npm run build` then replace the content of `./dist/website/` with the content of `./landingpage/dist`

#### Build browser extensions
```
deno run -A build.run.ts
```
or more precise
```
deno run --allow-env --allow-read --allow-run build.run.ts
```

#### Start Chrome extension
In Chrome go to `chrome://extensions/` and ensure that on the top right 'Developer mode' is toggled on. After that click `Load unpacked` and select the `./dist/chromeExtension` folder of this repository.\
Ensure that conflicting extensions are not running in the background (i.e. other extensions that redirect the same Top Level Domain).\
For further information about Chrome Extensions see [https://developer.chrome.com/docs/extensions](https://developer.chrome.com/docs/extensions).

#### Start Firefox extension
In Firefox go to `about:debugging#/runtime/this-firefox`. Then click on `Load Temporary Add-on...` and select a file in `./dist/firefoxExtension`.\
Ensure that conflicting extensions are not running in the background (i.e. other extensions that redirect the same Top Level Domain).\
For further information about Firefox Extensions see [https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension).

#### Run tests
```
deno test --allow-net
```