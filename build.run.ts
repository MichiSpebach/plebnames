import * as esbuild from 'https://deno.land/x/esbuild@v0.21.2/mod.js'
import { BuildResult } from 'https://deno.land/x/esbuild@v0.21.2/mod.js'
import { denoPlugins } from 'https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts'

await buildForChromeExtension()

async function buildForChromeExtension(): Promise<void> {
	const result: BuildResult = await build({outfile: './dist/chromeExtension/main.js'})
	console.log('buildForChromeExtension result:', result)
}

async function build(options: {outdir?: string, outfile?: string}): Promise<BuildResult> {
	const result: BuildResult = await esbuild.build({
		plugins: [...denoPlugins()],
		entryPoints: ['./core/src/main.ts'],
		bundle: true,
		...options
	})
	await esbuild.stop()
	return result
}