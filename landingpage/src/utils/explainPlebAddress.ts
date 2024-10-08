import { util } from 'plebnames';

export type AddressStructType = {
	/** Prefix of the Address. 'bc1q' */
	prefix: string;

	/** Chunks of the name, without the overflow! */
	fill: string[];

	/** When null, than this PlebAddress has no overflow, as it perfectly fits (Rare cases) */
	overflow: string | null;

	/** Bitcoin-CheckSum of the PlebAddress */
	checksum: string;
};

export type PlebAddressExplainedType = {
	/** The inputName, e.g. the search string */
	inputName: string;

	/**
	 * Just:
	 * ```ts
	 * plebnames.util.normalizeAsciiToBech32(inputName);
	 * ```
	 */
	normalizedName: string;

	/** generated plebAddress out of the inputName. */
	plebAddress: string;

	addressStruct: AddressStructType;
};

/**
 * Transforms:
 * ```ts
 * ''.padEnd(32, pad);
 * ```
 * into fill array and overflow string or null.
 *
 * TODO: Tests dafür schreiben
 */
const getFillAndOverflow = ({
	normalizedName,
}: {
	/** !The normalized name */
	normalizedName: string;
}): {
	/** Chunks of the name, without the overflow */
	fill: string[];
	/** When null, than this PlebAddress has no overflow, as it perfectly fits (Rare case) */
	overflow: string | null;
} => {
	const paddedString = ''.padEnd(32, normalizedName);
	const chunkSize = normalizedName.length;

	const fill = [];
	let overflow: string | null = null;

	// Split the padded text into chunks of `chunkSize` characters, excluding any overflow
	for (let i = 0; i < 32; i += chunkSize) {
		const chunk = paddedString.slice(i, i + chunkSize);

		if (chunk.length < chunkSize) {
			overflow = chunk;
			break; // Stop adding to fill when overflow starts
		} else {
			fill.push(chunk);
		}
	}

	return {
		fill,
		overflow,
	};
};

export default function generatePAExplanationForName(
	name: string,
): PlebAddressExplainedType {
	const normalizedName = util.normalizeAsciiToBech32(name);
	const plebAddress = util.generateBech32AddressWithPad(normalizedName);

	const { fill, overflow } = getFillAndOverflow({ normalizedName });

	return {
		inputName: name,
		normalizedName,
		plebAddress,

		addressStruct: {
			// Not sure if we can hardcode the prefix.
			prefix: 'bc1q' as const,
			fill,
			overflow,
			checksum: plebAddress.slice(-6), // Should be always the last six Chars by a Bech32-Address
		},
	};
}
