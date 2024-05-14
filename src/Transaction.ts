
export type Transaction = {
	inputs: {prev_out: {addr: string}}[]
	out: {script: string}[]
}