import * as esbuild from 'https://deno.land/x/esbuild@v0.21.2/mod.js'
import * as util from '../scriptUtil.ts'

await buildForNpmLibrary()

async function buildForNpmLibrary(): Promise<void> {
	await cleanup()
	await generateIndexJs()
	await generateDtsFiles()
	console.log('Done, you can now ("npm login" and) "npm publish" the library, but double check and test everything before that.')

	async function cleanup(): Promise<void> {
		console.log('cleaning up, removing old ./index.js, ./index.d.ts and ./dist/ if existing')
		await Promise.all([
			util.removeIfExists('./index.js'),
			util.removeIfExists('./index.d.ts'),
			util.removeIfExists('./dist/', {recursive: true})
		])
	}

	async function generateIndexJs(): Promise<void> {
		console.log('generating index.js')
		const result: esbuild.BuildResult = await esbuild.build({
			format: 'esm',
			entryPoints: ['./src/mod.ts'],
			bundle: true,
			outfile: './index.js',
			external: ['npm:bech32@2.0.0'],
		})
		await esbuild.stop()
		console.log('esbuild result:', result)
	
		console.log('replacing Deno imports with package.json imports')
		const indexJsContent: string = await Deno.readTextFile('./index.js')
		const bech32DenoImport: string = 'from "npm:bech32@2.0.0"'
		if (!indexJsContent.includes(bech32DenoImport)) {
			console.warn(`Deno import "${bech32DenoImport}" to replace not found in ./index.js`)
		}
		await Deno.writeTextFile('./index.js', indexJsContent.replaceAll(bech32DenoImport, 'from "bech32"'))
		console.log('generated index.js')
	}

	async function generateDtsFiles(): Promise<void> {
		console.log('generating .d.ts files with tsc')
		try {
			console.log(await util.exec('tsc --project tsconfig.generateDts.json'))
		} catch (error) {
			// TODO: works nonetheless, but fix this error
			console.warn(error)
		}
		
		console.log('moving ./dist/mod.d.ts to ./index.d.ts and removing ./main.d.ts')
		const indexDtsContent: string = await Deno.readTextFile('./dist/mod.d.ts')
		await Promise.all([
			Deno.writeTextFile('./index.d.ts', indexDtsContent.replaceAll("from './", "from './dist/")),
			Deno.remove('./dist/mod.d.ts'),
			Deno.remove('./dist/main.d.ts')
		])
		console.log('generated .d.ts files')
	}
}