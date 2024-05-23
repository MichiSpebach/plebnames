import { explorerAdapter } from './explorerAdapter.ts'
import * as util from './util.ts'

main()

async function main(): Promise<void> {
	const url: string|null = new URLSearchParams(window.location.search).get('url')
	document.body.innerHTML += '<br>coming from: '+url
	
	document.body.innerHTML += `<br><label for="url">url: </label><input id="url" value="${url}"></input>`
	setTimeout(() => document.getElementById('url')!.oninput = (event) => update(), 0)
	
	document.body.innerHTML += `<div><span>name: </span><span id="name"></span></div>`
	document.body.innerHTML += `<div id="normalizedName"></div>`
	document.body.innerHTML += `<div><span>padAddress: </span><span id="padAddress"></span></div>`
	document.body.innerHTML += `<button id="lookup">lookup padAddress</button>`
	setTimeout(() => document.getElementById('lookup')!.onclick = (event) => lookupPadAddress(), 0)
	document.body.innerHTML += `<div id="lookupResult"></div>`

	update()
}

function update(): void {
	const url: string = (document.getElementById('url') as any).value
	const name: string = getNameFromUrl(url)
	document.getElementById('name')!.textContent = name

	const normalizedName: string = util.normalizeAsciiToBech32(name)
	document.getElementById('normalizedName')!.textContent = `normalizedName: ${normalizedName}`

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
		url = url.slice(schemeIndex)
	}
	const startIndex: number = url.lastIndexOf('.')
	if (startIndex > -1) {
		url = url.slice(startIndex+1)
	}
	return url
}

async function lookupPadAddress(): Promise<void> {
	const name: string = document.getElementById('name')!.textContent!
	const padAddress: string = document.getElementById('padAddress')!.textContent!
	const lookupResultElement: HTMLElement = document.getElementById('lookupResult')!
	const claimer: {addr: string}|undefined = (await explorerAdapter.getFirstInputOfAddress(padAddress))
	if (!claimer) {
		lookupResultElement.innerHTML = `The name '${name}' is not claimed yet.<br>`
		lookupResultElement.innerHTML += `You can claim it by sending one Satoshi to '${padAddress}'.`
		return
	}
	lookupResultElement.innerHTML = `The name '${name}' was first claimed by '${claimer.addr}'.<br>`
	lookupResultElement.innerHTML += `There are following OP_RETURN scripts attached to it:`
	const scripts: string[] = await explorerAdapter.getOutScriptsOfAddress(claimer.addr)
	lookupResultElement.innerHTML += `<pre>${JSON.stringify(scripts, null, 4)}</pre>`
}

//window.location.replace('bitcoin.org')