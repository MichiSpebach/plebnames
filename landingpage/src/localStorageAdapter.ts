import { PlebNameHistory } from 'plebnames'

export function isHideBrowserExtensionBanner(): boolean {
	return window.localStorage.getItem('hideBrowserExtensionBanner') ? true : false
}

export function popPlebName(): string|null {
	const name = window.localStorage.getItem('plebName')
	window.localStorage.removeItem('plebName')
	return name
}

export function popPlebNameHistory(): PlebNameHistory|null {
	const history: string|null = window.localStorage.getItem('plebNameHistory')
	window.localStorage.removeItem('plebNameHistory')
	if (history === null || history === 'unclaimed') {
		return null
	}
	return Object.setPrototypeOf(JSON.parse(history!), PlebNameHistory.prototype)
}

export function popTipToInscribeWebsite(): boolean {
	const tip = window.localStorage.getItem('tipToInscribeWebsite') ? true : false
	window.localStorage.removeItem('tipToInscribeWebsite')
	return tip
}