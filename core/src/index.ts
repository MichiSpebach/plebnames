import { PlebNameHistory } from './PlebNameHistory.ts'
import { followNameHistory } from './bitcoinExplorer/explorerAdapter.ts'

const url: string|null = new URLSearchParams(window.location.search).get('url')
document.body.innerHTML = `looking up ${url}`

if (url) {
	const name: {prefix: string, name: string, suffix: string} = getNameFromUrl(url)
	let claimFetched: boolean = false
	const history: PlebNameHistory|'unclaimed' = await followNameHistory(name.name, {
		onAddressFetched: (history: PlebNameHistory, opReturnScripts: string[]) => {
			if (!claimFetched) {
				appendLine(`${history.name} was first claimed by ${history.getData().owner}.`)
				claimFetched = true
			} else {
				appendLine(`OP_RETURN scripts of ${history.getData().owner}:`)
			}
			for (const script of opReturnScripts) {
				appendLine(script)
			}
		}
	})
	if (history === 'unclaimed') {
		// TODO: load landingpage
	} else {
		const websiteOrUrl: string|undefined = history.getData().website
		if (!websiteOrUrl) {
			// TODO: load landingpage
		} else {
			const url = addSurroundingsToUrl(websiteOrUrl, name)
			appendLine(`redirecting to "${url}"...`)
			window.location.replace(url)
		}
	}
} else {
	// TODO: load landingpage
}

function appendLine(text: string): void {
	document.body.innerHTML += '<br>'
	document.body.append(text)
}

function getNameFromUrl(url: string): {prefix: string, name: string, suffix: string} {
	//return new URLPattern(url).hostname.split('.')[0]
	const tld: string = '.btc'
	let prefix: string = ''
	let suffix: string = ''
	if (url.endsWith(tld)) {
		url = url.slice(0, -tld.length)
	} else {
		const endIndex: number = url.indexOf(tld+'/')
		if (endIndex > 0) {
			suffix = url.slice(endIndex + tld.length)
			url = url.slice(0, endIndex)
		}
	}
	const schemeIndex: number = url.indexOf('//')
	if (schemeIndex > -1) {
		url = url.slice(schemeIndex+2)
	}
	const startIndex: number = url.lastIndexOf('.')
	if (startIndex > -1) {
		prefix = url.slice(0, startIndex+1)
		url = url.slice(startIndex+1)
	}
	return {prefix, name: url, suffix}
}

function addSurroundingsToUrl(url: string, surroundings: {prefix: string, suffix: string}): string {
	url = ensureProtocolOfUrl(url)
	const schemeIndex: number = url.indexOf('//')
	let prefix: string = ''
	if (schemeIndex > -1) {
		prefix = url.substring(0, schemeIndex+2)
		url = url.substring(schemeIndex+2)
	}
	if (url.startsWith('www.')) {
		prefix += 'www.'
		url = url.substring(4)
	}
	return prefix + surroundings.prefix + url + surroundings.suffix
}

function ensureProtocolOfUrl(url: string): string {
	if (!url.includes('://') && url.match(/^\w/)) {
		return `http://${url}`
	}
	return url
}