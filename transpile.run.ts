/// <reference lib="deno.ns" />
import { transpile } from 'https://deno.land/x/emit@0.40.0/mod.ts'

const results: Map<string, string> = await transpile(import.meta.resolve('./src/main.ts'))

const pros = []
for (const [key, value] of results.entries()) {
	const distPath: string = key.replace(import.meta.resolve('./')+'src/', 'dist/').replace('.ts', '.js')
	const js = value.replaceAll(".ts';", ".js';") // does not only match imports, TODO: find some option in transpile(..) or use bundle(..) or another library instead
	pros.push(Deno.writeTextFile(distPath, js, {create: true}))
}
await Promise.all(pros)