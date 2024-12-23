import * as esbuild from 'https://deno.land/x/esbuild@v0.21.2/mod.js'
import { BuildResult } from 'https://deno.land/x/esbuild@v0.21.2/mod.js'
import { denoPlugins } from 'https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts'
import * as util from './scriptUtil.ts'
import * as fs from 'https://deno.land/std@0.224.0/fs/mod.ts'

await buildForChromeExtension()
await buildForFirefoxExtension()

async function buildForChromeExtension(): Promise<void> {
	const result: BuildResult = await build({outfile: './dist/chromeExtension/index.js'})
	console.log('buildForChromeExtension result:', result)
	await buildLandingpageAndCopyInto('./dist/chromeExtension/landingpage/')
}

async function buildForFirefoxExtension(): Promise<void> {
	const result: BuildResult = await build({outfile: './dist/firefoxExtension/index.js'})
	console.log('buildForFirefoxExtension result:', result)
	await buildLandingpageAndCopyInto('./dist/firefoxExtension/landingpage/')
}

async function buildLandingpageAndCopyInto(destPath: string) {
	console.log('runnig "cd ./landingpage && npm run build" might take a while...')
	console.log(await util.exec('cd ./landingpage && npm run build'))
	
	await util.removeIfExists(destPath, {recursive: true}) // remove existing for clean copy
	await fs.copy('./landingpage/dist/', destPath, {overwrite: false})
	
	const indexHtmlPath: string = destPath+'index.html'
	let indexHtmlContent: string = await Deno.readTextFile(indexHtmlPath)
	
	const pathToFix: string = '"/assets/index'
	const fixedPath: string = '"./assets/index'
	if (!indexHtmlContent.includes(pathToFix)) {
		console.warn(`paths to fix "${pathToFix}" not found in ${indexHtmlPath}`)
	}
	indexHtmlContent = indexHtmlContent.replaceAll(pathToFix, fixedPath)
	
	const iconPathToFix: string = 'href="/vite.svg"'
	const fixedIconPath: string = 'href="../icon.png"'
	if (!indexHtmlContent.includes(iconPathToFix)) {
		console.warn(`iconPath to fix "${iconPathToFix}" not found in ${indexHtmlPath}`)
	}
	indexHtmlContent = indexHtmlContent.replace(iconPathToFix, fixedIconPath)
	
	await Deno.writeTextFile(indexHtmlPath, indexHtmlContent)
}

async function build(options: {outdir?: string, outfile?: string}): Promise<BuildResult> {
	const result: BuildResult = await esbuild.build({
		plugins: [...denoPlugins()],
		entryPoints: ['./core/src/index.ts'],
		format: 'esm',
		bundle: true,
		...options
	})
	await esbuild.stop()
	return result
}