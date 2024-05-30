import { PadAddressHistory } from './PadAddressHistory.ts'
import { explorerAdapter } from './explorerAdapter.ts'
import * as util from './util.ts'

main()

async function main(): Promise<void> {
	const url: string|null = new URLSearchParams(window.location.search).get('url')

	document.body.innerHTML = `
		<table style="margin:auto">
			${buildRowHtml({html: ''}, {html: 'Test', style: 'font-size:200%'})}
			${buildRowHtml({html: 'coming from: '}, {html: url ?? undefined})}
			${buildRowHtml({html: '<label for="url">url: </label>'}, {html: `<input id="url" value="${url}"></input>`})}
			${buildRowHtml({html: 'name: '}, {id: 'name'})}
			${buildRowHtml({html: 'normalizedName: '}, {id: 'normalizedName'})}
			${buildRowHtml({html: 'padAddress: '}, {id: 'padAddress'})}
			${buildRowHtml({html: 'broadestAddress: '}, {html: util.generateBech32AddressWithPad('m')}, 'visibility:hidden;line-height:0')}
			${buildRowHtml({html: ''}, {html: '<button id="lookup" style="cursor:pointer">lookup padAddress</button>'})}
		</table>
		<div id="lookupResult"></div>
	`

	setTimeout(() => document.getElementById('url')!.oninput = (event) => updateNamesAndPadAddress(), 0)
	setTimeout(() => document.getElementById('lookup')!.onclick = (event) => lookupPadAddress(), 0)

	updateNamesAndPadAddress()
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

function updateNamesAndPadAddress(): void {
	const url: string = (document.getElementById('url') as any).value
	const name: string = getNameFromUrl(url)
	document.getElementById('name')!.textContent = name

	const normalizedName: string = util.normalizeAsciiToBech32(name)
	document.getElementById('normalizedName')!.textContent = normalizedName

	const padAddress: string = util.generateBech32AddressWithPad(normalizedName)
	document.getElementById('padAddress')!.textContent = padAddress
}

function getNameFromUrl(url: string): string {
	//return new URLPattern(url).hostname.split('.')[0]
	if (url.endsWith('.test')) {
		url = url.slice(0, '.test'.length)
	} else {
		const endIndex: number = url.indexOf('.test/')
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

async function lookupPadAddress(): Promise<void> {
	const lookupResultElement: HTMLElement = getLookupResultElement()
	lookupResultElement.innerHTML = 'looking up...'

	const padAddress: string = document.getElementById('padAddress')!.textContent!
	const name: string = document.getElementById('name')!.textContent!

	const claimer: {addr: string}|undefined = (await explorerAdapter.getFirstInputOfAddress(padAddress))
	if (!claimer) {
		lookupResultElement.innerHTML = `The name '${name}' is not claimed yet.<br>`
		lookupResultElement.innerHTML += `You can claim it by sending one Satoshi to '${padAddress}'.`
		return
	}
	lookupResultElement.innerHTML = `The name '${name}' was first claimed by '${claimer.addr}'.<br>`
	
	const history = new PadAddressHistory(name, claimer.addr)
	await followChanges(history)
}

async function followChanges(history: PadAddressHistory): Promise<void> {
	let owner: string|undefined = undefined
	while (owner !== history.getData().owner) {
		owner = history.getData().owner
		const scripts: string[] = await explorerAdapter.getOutScriptsOfAddress(owner)
		for (const script of scripts) {
			history.addChangeFromOpReturnScript(script)
			if (owner !== history.getData().owner) {
				break
			}
		}
	}
	getLookupResultElement().innerHTML += `
		The current owner is '${history.getData().owner}'<br>
		The current website is <a href="${history.getData().website}">${history.getData().website}</a><br>
		The current lightningAddress is ${history.getData().lightningAddress}<br>
		All current data:
		<pre>${JSON.stringify(history.getData(), null, 4)}</pre>
		<details>
			<summary style="cursor:pointer">History</summary>
			<pre>${JSON.stringify(history.getChanges(), null, 4)}</pre>
		</details>
		<details>
			<summary style="cursor:pointer">All related OP_RETURN scripts</summary>
			<pre>${JSON.stringify('scripts', null, 4)}</pre>
		</details>
	`
}

function getLookupResultElement(): HTMLElement {
	return document.getElementById('lookupResult')!
}

//window.location.replace('bitcoin.org')