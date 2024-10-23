import * as nodeProcess from 'node:child_process'

export async function removeIfExists(path: string | URL, options?: Deno.RemoveOptions): Promise<void> {
	try {
		await Deno.remove(path, options)
	} catch (error) {
		if (!(error instanceof Deno.errors.NotFound)) {
			throw error
		}
	}
}

export function exec(command: string): Promise<string> {
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