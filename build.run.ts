import * as esbuild from 'https://deno.land/x/esbuild@v0.21.2/mod.js'
import { BuildResult } from 'https://deno.land/x/esbuild@v0.21.2/mod.js'
import { denoPlugins } from 'https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts'

const result: BuildResult = await esbuild.build({
	plugins: [...denoPlugins()],
	entryPoints: ['./src/main.ts'],
	outdir: './dist',
	bundle: true,
})

console.log(result)

esbuild.stop()