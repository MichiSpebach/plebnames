// import { UAParser, IBrowser } from 'ua-parser-js';
// const ua = new UAParser();

/** Additional Types for `ua-parser-js` from the Documentation */
export namespace UAParserNameTypes {
	/** from https://docs.uaparser.dev/list/os/name.html */
	export type OSNameType =
		| 'AIX'
		| 'Amiga OS'
		| 'Android'
		| 'Android-x86'
		| 'Arch'
		| 'Bada'
		| 'BeOS'
		| 'BlackBerry'
		| 'CentOS'
		| 'Chrome OS'
		| 'Chromecast'
		| 'Contiki'
		| 'Debian'
		| 'Deepin'
		| 'DragonFly'
		| 'elementary OS'
		| 'Fedora'
		| 'Firefox OS'
		| 'FreeBSD'
		| 'Fuchsia'
		| 'Gentoo'
		| 'GhostBSD'
		| 'GNU'
		| 'Haiku'
		| 'HarmonyOS'
		| 'HP-UX'
		| 'Hurd'
		| 'iOS'
		| 'Joli'
		| 'KaiOS'
		| 'Linpus'
		| 'Linspire'
		| 'Linux'
		| 'macOS'
		| 'Maemo'
		| 'Mageia'
		| 'Mandriva'
		| 'Manjaro'
		| 'MeeGo'
		| 'Minix'
		| 'Mint'
		| 'Morph OS'
		| 'NetBSD'
		| 'NetRange'
		| 'NetTV'
		| 'Nintendo'
		| 'OpenBSD'
		| 'OpenVMS'
		| 'OS/2'
		| 'Palm'
		| 'PC-BSD'
		| 'PCLinuxOS'
		| 'Pico'
		| 'Plan9'
		| 'PlayStation'
		| 'QNX'
		| 'Raspbian'
		| 'RedHat'
		| 'RIM Tablet OS'
		| 'RISC OS'
		| 'Sabayon'
		| 'Sailfish'
		| 'SerenityOS'
		| 'Series40'
		| 'Slackware'
		| 'Solaris'
		| 'SUSE'
		| 'Symbian'
		| 'Tizen'
		| 'Ubuntu'
		| 'Unix'
		| 'VectorLinux'
		| 'watchOS'
		| 'WebOS'
		| 'Windows'
		| 'Windows Phone'
		| 'Windows Mobile'
		| 'Xbox'
		| 'Zenwalk';

	/** from https://docs.uaparser.dev/list/browser/name.html */
	export type BrowserNameType =
		| '2345Explorer'
		| '360 Browser'
		| 'Alipay'
		| 'Amaya'
		| 'Android Browser'
		| 'Arora'
		| 'Avant'
		| 'Avast Secure Browser'
		| 'AVG Secure Browser'
		| 'Baidu Browser'
		| 'Basilisk'
		| 'Blazer'
		| 'Bolt'
		| 'Brave'
		| 'Bowser'
		| 'Camino'
		| 'Chimera'
		| 'Chrome'
		| 'Chrome Mobile'
		| 'Chrome Headless'
		| 'Chrome WebView'
		| 'Chromium'
		| 'Cobalt'
		| 'Coc Coc'
		| 'Comodo Dragon'
		| 'Conkeror'
		| 'Dillo'
		| 'Dolphin'
		| 'Doris'
		| 'DuckDuckGo'
		| 'Edge'
		| 'Electron'
		| 'Epiphany'
		| 'Facebook'
		| 'Falkon'
		| 'Fennec'
		| 'Firebird'
		| 'Firefox'
		| 'Firefox Focus'
		| 'Firefox Mobile'
		| 'Firefox Reality'
		| 'Flock'
		| 'Flow'
		| 'GoBrowser'
		| 'GSA'
		| 'Helio'
		| 'HeyTap'
		| 'Huawei Browser'
		| 'iCab'
		| 'ICE Browser'
		| 'IceApe'
		| 'IceCat'
		| 'IceDragon'
		| 'Iceweasel'
		| 'IE'
		| 'IEMobile'
		| 'Instagram'
		| 'Iridium'
		| 'Iron'
		| 'Jasmine'
		| 'K-Meleon'
		| 'KakaoStory'
		| 'KakaoTalk'
		| 'Kindle'
		| 'Klar'
		| 'Klarna'
		| 'Konqueror'
		| 'LBBROWSER'
		| 'Line'
		| 'LinkedIn'
		| 'Links'
		| 'Lunascape'
		| 'Lynx'
		| 'Maemo Browser'
		| 'Maxthon'
		| 'Midori'
		| 'Minimo'
		| 'MIUI Browser'
		| 'Mosaic'
		| 'Mozilla'
		| 'Naver'
		| 'NetFront'
		| 'Netscape'
		| 'NetSurf'
		| 'Nokia Browser'
		| 'Obigo'
		| 'Oculus Browser'
		| 'OmniWeb'
		| 'Opera'
		| 'Opera Coast'
		| 'Opera GX'
		| 'Opera Mini'
		| 'Opera Mobi'
		| 'Opera Tablet'
		| 'Opera Touch'
		| 'OviBrowser'
		| 'PaleMoon'
		| 'PhantomJS'
		| 'Phoenix'
		| 'Pico Browser'
		| 'Polaris'
		| 'Puffin'
		| 'QQBrowser'
		| 'QQBrowserLite'
		| 'Quark'
		| 'QupZilla'
		| 'Rekonq'
		| 'RockMelt'
		| 'Safari'
		| 'Safari Mobile'
		| 'Sailfish Browser'
		| 'Samsung Internet'
		| 'SeaMonkey'
		| 'Silk'
		| 'Skyfire'
		| 'Sleipnir'
		| 'SlimBrowser'
		| 'Smart Lenovo Browser'
		| 'Snapchat'
		| 'Sogou Explorer'
		| 'Sogou Mobile'
		| 'Swiftfox'
		| 'Tesla'
		| 'TikTok'
		| 'Tizen Browser'
		| 'UCBrowser'
		| 'UP.Browser'
		| 'Vivaldi'
		| 'Vivo Browser'
		| 'w3m'
		| 'Waterfox'
		| 'WeChat'
		| 'Weibo'
		| 'Whale'
		| 'Wolvic'
		| 'Yandex';
}
