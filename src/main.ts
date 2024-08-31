import { PlebNameHistory } from './PlebNameHistory.ts'
import { InputPrevout } from './bitcoinExplorer/Transaction.ts'
import { explorerAdapter } from './bitcoinExplorer/explorerAdapter.ts'
import * as util from './util.ts'

main()

async function main(): Promise<void> {
	const showUrl: boolean = Boolean(document.currentScript?.getAttribute('showUrl'))
	const url: string|null = new URLSearchParams(window.location.search).get('url')
	const urlRedirect: boolean = Boolean(document.currentScript?.getAttribute('urlRedirect'))

	const urlStyle: string|undefined = showUrl ? undefined : 'display:none'

	document.body.innerHTML = `
		<div style="font-size:200%;text-align:center">PlebNames</div>
		PlebNames are piggybacked names on Bitcoin, just Bitcoin.<br>
		Only normal Bitcoin explorers are required, no other server infrastructure or sidechain.<br>
		Also see: <a target="blank" href="https://github.com/MichiSpebach/plebnames">https://github.com/MichiSpebach/plebnames</a>.<br><br>
		<div style="cursor:pointer;font-size:150%">Look-up names or claim yours:</div>
		<table style="margin:auto">
			${buildRowHtml({html: 'coming from: '}, {html: url ?? undefined}, urlStyle)}
			${buildRowHtml({html: '<label for="url">url: </label>'}, {html: `<input id="url" value="${url}"></input>`}, urlStyle)}
			${buildRowHtml({html: '<label for="name">name: </label>'}, {html: `<input id="name" placeholder="input name of choice" value=""></input>`})}
			${buildRowHtml({html: 'normalizedName: '}, {id: 'normalizedName'})}
			${buildRowHtml({html: 'plebAddress: '}, {id: 'plebAddress'})}
			${buildRowHtml({html: 'broadestAddress: '}, {html: util.generateBech32AddressWithPad('m')}, 'visibility:hidden;line-height:0')}
			${buildRowHtml({html: ''}, {html: '<button id="lookup" style="cursor:pointer;font-size:121%">lookup</button>'})}
		</table>
		<div id="lookupResult"></div>
	`

	updateNamesAndPlebAddress()
	if (url) {
		lookupPlebAddress({redirectToWebsiteOrUrl: urlRedirect})
	}

	getInputElement('url').oninput = () => updateNamesAndPlebAddress()
	getInputElement('name').oninput = () => updateNormalizedNameAndPlebAddress()
	setOnKeydownEnterToElement('url', () => lookupPlebAddress())
	setOnKeydownEnterToElement('name', () => lookupPlebAddress())
	getElement('lookup').onclick = () => lookupPlebAddress()

	function setOnKeydownEnterToElement(elementId: InputElementId, onEnter: () => void): void {
		getInputElement(elementId).onkeydown = (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				onEnter()
			}
		}
	}
}

function buildRowHtml(left: {html: string}, right: {html?: string, id?: string, style?: string}, style?: string): string {
	const styleHtml: string =style ? `style="${style}"` : ''
	const rightId: string = right.id ? `id="${right.id}"` : ''
	const rightStyle: string = right.style ? `style="${right.style}"` : ''
	return `<tr ${styleHtml}>
		<td style="text-align:right">${left.html}</td>
		<td ${rightId} ${rightStyle}>${right.html}</td>
	</tr>`
}

function updateNamesAndPlebAddress(): void {
	const url: string = getInputElement('url').value
	const name: string = url === 'null' ? '' : getNameFromUrl(url)

	getInputElement('name').value = name

	updateNormalizedNameAndPlebAddress()
}

function updateNormalizedNameAndPlebAddress(): void {
	const name: string = getInputElement('name').value

	const normalizedName: string = util.normalizeAsciiToBech32(name)
	document.getElementById('normalizedName')!.textContent = normalizedName
	
	const plebAddress: string = util.generateBech32AddressWithPad(normalizedName)
	document.getElementById('plebAddress')!.textContent = plebAddress
}

function getNameFromUrl(url: string): string {
	//return new URLPattern(url).hostname.split('.')[0]
	const tld: string = '.btc'
	if (url.endsWith(tld)) {
		url = url.slice(0, -tld.length)
	} else {
		const endIndex: number = url.indexOf(tld+'/')
		if (endIndex > 0) {
			url = url.slice(0, endIndex)
		}
	}
	const schemeIndex: number = url.indexOf('//')
	if (schemeIndex > -1) {
		url = url.slice(schemeIndex+2)
	}
	const startIndex: number = url.lastIndexOf('.')
	if (startIndex > -1) {
		url = url.slice(startIndex+1)
	}
	return url
}

async function lookupPlebAddress(options?: {redirectToWebsiteOrUrl?: boolean}): Promise<void> {
	const name: string = getInputElement('name').value
	const plebAddress: string = getElement('plebAddress').textContent!
	const lookupResultElement: HTMLElement = getElement('lookupResult')

	if (plebAddress.length < 15) {
		lookupResultElement.innerHTML = '<pre style="color:red">Input a name, then click lookup.</pre>'
		return
	}
	lookupResultElement.innerHTML = 'looking up...'

	const claimerInput: InputPrevout|undefined = await explorerAdapter.getFirstInputOfAddress(plebAddress)
	lookupResultElement.innerHTML = `<div style="font-size:150%">Information about ${name}</div>`
	if (!claimerInput) {
		lookupResultElement.innerHTML += `The name '${name}' is not claimed yet.<br>`
		lookupResultElement.innerHTML += `You can claim it by sending a minimum amount of satoshis (atm 546) to '${plebAddress}'.`
		showScriptOptions(name, '${addressUsedToSentToPlebAddress}')
		return
	}
	const claimer: string = claimerInput.scriptpubkey_address ?? claimerInput.scriptpubkey
	lookupResultElement.innerHTML += `The name '${name}' was first claimed by '${claimer}'.<br>`
	
	const history = new PlebNameHistory(name, claimer)
	await followChanges(history)
	const websiteOrUrl: string|undefined = history.getData().website
	if (options?.redirectToWebsiteOrUrl && websiteOrUrl) {
		window.location.replace(websiteOrUrl)
	} else {
		showScriptOptions(history.name, history.getData().owner)
	}
}

async function followChanges(history: PlebNameHistory): Promise<void> {
	getElement('lookupResult').innerHTML += `
		<div id="lookupResultData">
			looking up...
		</div>
		<details>
			<summary style="cursor:pointer">History</summary>
			<pre id="lookupResultHistory"></pre>
		</details>
		<details>
			<summary style="cursor:pointer">All related OP_RETURN scripts</summary>
			<pre id="lookupResultRelatedScripts"></pre>
		</details>
	`

	let owner: string|undefined = undefined
	while (owner !== history.getData().owner) {
		owner = history.getData().owner
		const scripts: string[] = await explorerAdapter.getOpReturnOutScriptsOfAddress(owner)
		document.getElementById('lookupResultRelatedScripts')!.innerHTML += JSON.stringify({issuer: owner, scripts}, null, 4)+'\n'
		for (const script of scripts) {
			history.addChangeFromOpReturnScript(script)
			document.getElementById('lookupResultHistory')!.innerHTML = JSON.stringify(history.getChanges(), null, 4)
			if (owner !== history.getData().owner) {
				break
			}
		}
	}

	document.getElementById('lookupResultData')!.innerHTML = `
		The current owner is '${history.getData().owner}'<br>
		The current Nostr npub is <a href="https://iris.to/${history.getData().nostr}" target="_blank">${history.getData().nostr}</a><br>
		The current website is <a href="${history.getData().website}">${history.getData().website}</a><br>
		The current lightningAddress is ${history.getData().lightningAddress}<br>
		All current data:
		<pre>${JSON.stringify(history.getData(), null, 4)}</pre>
	`
}

function showScriptOptions(name: string, owner: string): void {
	getElement('lookupResult').innerHTML += `
		<div style="margin-top:8px; font-size:150%">Alter ${name}</div>
		<div style="display:flex">
			<select id="lookupResultSelect">
				<option value="nostr">Nostr</option>
				<option value="website">website</option>
				<option value="owner">owner</option>
				<option value="lightningAddress">lightningAddress</option>
				<option value="any">any</option>
			</select>
			<input id="lookupResultSelectInput" style="margin-left:4px"></input>
			=
			<input id="lookupResultSelectValue" style="flex-grow:1"><br>
		</div>
		<div id="lookupResultSelectWarning" style="color:red">
			When changing owner you transfer '${name}' to another address, be sure to type in the address correctly because<br>
			you cannot change anything regarding '${name}' afterwards (there are no checksums put in yet TODO)<br>
		</div>
		To add or change data of '${name}' send following OP_RETURN script from '${owner}'<br>
		e.g. with Electrum with amount 0:<br>
		<div style="display:flex">
			<pre id="lookupResultSelectProposedScript" style="margin:0 4px 0 0;border:1px solid; padding:4px 8px;"></pre>
			<button id="lookupResultSelectProposedScriptCopy" style="cursor:pointer" title="copy">&#x1f4cb;</button>
		</div>
		<div id="lookupResultSelectProposedScriptValueAscii"></div>
	`
	
	getElement('lookupResultSelect').oninput = () => {
		updateScriptOptions(name)
		;(getElement('lookupResultSelectValue') as HTMLInputElement).value = ''
	}
	getElement('lookupResultSelectInput').oninput = () => updateScriptOptions(name)
	getElement('lookupResultSelectValue').oninput = () => updateScriptOptions(name)
	getElement('lookupResultSelectProposedScriptCopy').onclick = () => navigator.clipboard.writeText(getElement('lookupResultSelectProposedScript').innerHTML)

	updateScriptOptions(name)
}

function updateScriptOptions(name: string): void {
	let key: string = (getElement('lookupResultSelect') as HTMLInputElement).value
	if (key === 'any') {
		key = (getElement('lookupResultSelectInput') as HTMLInputElement).value
		getElement('lookupResultSelectInput').style.display = ''
	} else {
		getElement('lookupResultSelectInput').style.display = 'none'
	}
	if (key === 'owner') {
		getElement('lookupResultSelectWarning').style.display = ''
	} else {
		getElement('lookupResultSelectWarning').style.display = 'none'
	}

	const valueElement: HTMLInputElement = getElement('lookupResultSelectValue') as HTMLInputElement
	switch (key) {
		case 'owner':
			valueElement.placeholder = 'bc1qtp8nlplz7myycp5vtyy7zd7a7c2xgkwx7hsssr'
			break
		case 'nostr':
			valueElement.placeholder = 'npub023456789acdefghjklmnpqrstuvwxyz023456789acdefghjklmnpqrstu'
			break
		case 'website':
			valueElement.placeholder = 'https://bitcoin.org'
			break
		default:
			valueElement.placeholder = ''
	}
	const scriptValue: string = `${name}.${key}=${valueElement.value}`

	getElement('lookupResultSelectProposedScript').textContent = `script(OP_RETURN ${util.asciiToHex(scriptValue)})`
	getElement('lookupResultSelectProposedScriptValueAscii').textContent = `The scriptValue is encoded in hex, in ascii it is "${scriptValue}".`
}

type InputElementId = 'url'|'name'

type ElementId = InputElementId |
	'plebAddress'|
	'lookup'|
	'lookupResult'|
	'lookupResultSelect'|
	'lookupResultSelectInput'|
	'lookupResultSelectValue'|
	'lookupResultSelectWarning'|
	'lookupResultSelectProposedScript'|
	'lookupResultSelectProposedScriptCopy'|
	'lookupResultSelectProposedScriptValueAscii'

function getInputElement(id: InputElementId): HTMLInputElement {
	return getElement(id) as HTMLInputElement
}

function getElement(id: ElementId): HTMLElement {
	return document.getElementById(id)!
}