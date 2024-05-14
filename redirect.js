//console.log('Hello World')

/*chrome.webRequest.onBeforeRequest.addListener(function(details) {
	console.log('redirecting')
	return {redirectUrl: 'https://bitcoin.org'}
}, {urls: ['*://*.test/*']}, ['blocking'])*/

//chrome.runtime.onInstalled.addListener(() => {
chrome.declarativeNetRequest.updateDynamicRules({
	removeRuleIds: [1],
	addRules: [
		{
			"id": 1,
			"priority": 1,
			"condition": {
				"regexFilter": ".*\\.test(.*)",
				"resourceTypes": ["main_frame"]
			},
			"action": {
				"type": "redirect",
				"redirect": {"regexSubstitution": `chrome-extension://${chrome.runtime.id}/index.html?url=\\0`}
			}
		}
	]
})
//})