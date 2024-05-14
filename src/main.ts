import { explorerAdapter } from './explorerAdapter.js'
import * as util from './util.js'

main()

async function main(): Promise<void> {
	const url: string = new URLSearchParams(window.location.search).get('url')
	document.body.innerHTML += '<br>coming from: '+url
	//document.body.innerHTML += 'first input:<br><pre>'+JSON.stringify(firstInput, null, '\t')+'</pre>'

	//document.body.innerHTML += 'all inputs:<br><pre>'+JSON.stringify(inputs, null, '\t')+'</pre>'

	//document.body.innerHTML += 'scripts:<br><pre>'+JSON.stringify(scripts, null, '\t')+'</pre>'
}

//window.location.replace('bitcoin.org')