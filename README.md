### About PlebNames
PlebNames are piggybacked names on Bitcoin, just normal Bitcoin-Nodes are required, no other server infrastructure or sidechain.\
A PlebName is unique and is owned by one clear pleb at a time (or with multisig a group of plebs).

PlebNames to fastly lookup information about a PlebName, like the current lightningAddress of a pleb

### Why PlebNames
PlebNames give every pleb a clear unique name that can be spoken and easily remembered.\
For example when doing a transaction: Instead of typing in a long address you just type in the PlebName of the pleb. The Wallet then looks in the Bitcoin mainchain to whom the PlebName belongs and resolves the PlebName to the actual address.

### How can I get my PlebName
Convert your name to Bech32. As Bech32 is missing some letters let's agree b converts to 8, i to 7 and o to 0.\
For example "Ego" is a great name, "Ego" converts to "eg0".
Problem: "eg0" is not a valid Bitcoin-Address. Luckily there is one very obvious and deterministic way:\
Prefix it with "bc1q" and as you are proud of your name repeat it as long as possible (reach 32 letters), then suffix it with the 6 letter checksum.\
We get "bc1qeg0eg0eg0eg0eg0eg0eg0eg0eg0eg0egt7y40w" and call it PlebAddress, the PlebAddress of a name is unambiguous, there is exactly one PlebAddress for a name.\
In a blockchain explorer of your choice or your Bitcoin-Node search for your PlebAddress to ensure it is not claimed yet.\
Send or burn the smallest Satoshi count to your PlebAddress that is distributed in the mempool and accepted by miners.\
We agree the first one who sent to a PlebAddress claimed the related PlebName.

### What can you do with your PlebName
You can own it, really own it.\
You can publish the most precious information about your name that should be able to be fastly looked up by everyone.\
E.g. your current lightningAddress.\
You can update these most precious information and transfer a PlebName to somebody else.

### Why do PlebNames abuse Bitcoin-Addresses?
Bitcoin-Addresses are indexed by every Bitcoin-Node. This makes it very easy to find out when a PlebAddress first occured.\
It enables a very simple code snipped to look-up when a PlebName was first claimed.\
This makes PlebNames a simple, ubiquitous, uncensorable and fast Protocol.

### Develop
#### Prerequisites
Install the JavaScript runtime Deno: https://docs.deno.com/runtime/manual \
When working with VS Code the Deno extension by denoland is recommended: https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno \
To get an overview of the code base try out Mammutmap: https://marketplace.visualstudio.com/items?itemName=mammutmap.mammutmap

#### Build
```
deno run --allow-all build.run.ts
```
or more precise
```
deno run --allow-env --allow-read --allow-run build.run.ts
```

#### Start Website
Just open [./website/index.html](./website/index.html) in a web browser.

#### Start Chrome Extension
In Chrome go to `chrome://extensions/`, on the top left click `Load unpacked` and select the `chromeExtension` folder of this repository.\
Ensure that conflicting extensions are not running in the background (i.e. other extensions that redirect the same Top Level Domain).\
For further information about Chrome Extensions see [https://developer.chrome.com/docs/extensions](https://developer.chrome.com/docs/extensions).

#### Run Tests
```
deno test --allow-net
```