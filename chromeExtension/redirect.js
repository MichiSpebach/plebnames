chrome.declarativeNetRequest.updateDynamicRules({
	removeRuleIds: [1],
	addRules: [
		{
			"id": 1,
			"priority": 1,
			"condition": {
				"regexFilter": ".*\\.btc(.*)",
				"resourceTypes": ["main_frame"]
			},
			"action": {
				"type": "redirect",
				"redirect": {"regexSubstitution": `chrome-extension://${chrome.runtime.id}/index.html?url=\\0`}
			}
		}
	]
})