import * as esbuild from 'https://deno.land/x/esbuild@v0.21.2/mod.js'
import * as nodeProcess from 'node:child_process'

await buildForNpmLibrary()

async function buildForNpmLibrary(): Promise<void> {
	await cleanup()
	await generateIndexJs()
	await generateDtsFiles()
	console.log('Done, you can now ("npm login" and) "npm publish" the library, but double check and test everything before that.')

	async function cleanup(): Promise<void> {
		console.log('cleaning up, removing old ./index.js, ./index.d.ts and ./dist/ if existing')
		await Promise.all([
			removeIfExists('./index.js'),
			removeIfExists('./index.d.ts'),
			removeIfExists('./dist/', {recursive: true})
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
			console.log(await exec('tsc --project tsconfig.generateDts.json'))
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

async function removeIfExists(path: string | URL, options?: Deno.RemoveOptions): Promise<void> {
	try {
		await Deno.remove(path, options)
	} catch (error) {
		if (!(error instanceof Deno.errors.NotFound)) {
			throw error
		}
	}
}

function exec(command: string): Promise<string> {
	let resolvePromise: (value: string) => void
	let rejectPromise: (error: Error) => void
	const promise = new Promise<string>((resolve, reject) => {
		resolvePromise = resolve
		rejectPromise = reject
	})

	nodeProcess.exec(command, (error: nodeProcess.ExecException|null, stdout: string, stderr: string) => {
		if (error !== null) {
			rejectPromise(error)
		} else if (stderr.length > 0) {
			rejectPromise(new Error(stderr))
		} else {
			resolvePromise(stdout)
		}
	})

	return promise
}