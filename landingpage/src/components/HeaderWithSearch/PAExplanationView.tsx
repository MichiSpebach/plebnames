import {
	AddressStructType,
	PlebAddressExplainedType,
} from '@/src/utils/explainPlebAddress';
import React from 'react';
import Bech32AddressLink from '../Bech32AddressLink';
import MarkedTextWithCopy from '../MarkedTextWithCopy';
import DropDownContent from './DropDownContent';
import PALegend from './PALegend';

/**
 * Used for explaining the PlebAddress fill.
 * Generates a description of the fill situation.
 */
function generateFillDescription(
	fill: AddressStructType['fill'],
): React.ReactNode {
	let afterText =
		fill.length === 1
			? `is repeated once.`
			: `is repeated ${fill.length} times.`;

	return (
		<>
			<MarkedTextWithCopy clickToCopy={false}>
				{fill[0]}
			</MarkedTextWithCopy>{' '}
			{afterText}
		</>
	);
}

/**
 * Used for explaining the PlebAddress overflow.
 *
 * Generates a description of the overflow situation, including information about
 * overflow and fill characteristics.
 */
function generateOverflowDescription(
	addressStruct: AddressStructType,
): React.ReactNode {
	if (addressStruct.overflow === null) {
		const fillLength = addressStruct.fill[0].length;
		const segmentCount = addressStruct.fill.length;

		const fillDescription =
			fillLength === 1
				? 'a single character'
				: `${fillLength} characters`;
		const segmentDescription =
			segmentCount === 1
				? 'One segment of this length fits'
				: `${segmentCount} segments of this length fit`;

		return `No overflow detected. The normalized fill is ${fillDescription} long. ${segmentDescription} exactly into 32 characters, so there is no overflow.`;
	}

	return (
		<>
			Overflow detected:{' '}
			<MarkedTextWithCopy clickToCopy>
				{addressStruct.overflow}
			</MarkedTextWithCopy>{' '}
			.
		</>
	);
}

/**
 * Some info which explains the structure of the pleb-address.
 */
const PAExplanationView: React.FC<PlebAddressExplainedType> = ({
	addressStruct,
	inputName,
	normalizedName,
	plebAddress,
}) => (
	<DropDownContent title={'The PlebAddress Explained'}>
		<p>
			Your input name <span className="font-mono">'{inputName}'</span> is
			automatically normalized, meaning certain characters are adjusted or
			mapped for you. After normalization, your name becomes{' '}
			<span className="font-mono">'{normalizedName}'</span>, which is used
			to generate a <Bech32AddressLink />. To achieve this, the normalized
			name is repeated until it reaches exactly 32 characters.
			<br />
			<br />
			Finally, we add the prefix <span className="font-mono">
				'bc1q'
			</span>{' '}
			and calculate the checksum to ensure the address is valid, resulting
			in a valid Bitcoin Address that we call PlebAddress:
			<MarkedTextWithCopy clickToCopy>{plebAddress}</MarkedTextWithCopy>
			<br />
			<br />
			Note that nobody has the private key for this address. However, the
			private key is not required for identifying the owner or reading the
			name's configuration. To determine ownership and retrieve the
			related configuration, we look up who initially claimed the name by
			sending at least one satoshi to the pleb-address. Once we find the
			original transaction, we track ownership changes, if any, and can
			access the configuration tied to the name.
			<br />
			<br />
			If the current owner wishes to modify the name's configuration after
			it has been claimed, they can use the "Inscribe Entries" tool below.
			<br />
			This tool generates an OP_RETURN template that references the
			PlebName and specifies the desired changes, enabling the owner to
			update the configuration on-chain.
			<br />
			<br />
		</p>

		<span className="pb-2 text-lg font-bold">
			PlebAddress Structure Explained:
		</span>

		<span
			className="mb-4 inline-flex w-full overflow-x-scroll bg-white pb-1 font-mono"
			style={{
				fontSize: '1rem',
				letterSpacing: '0.10rem',
			}}
		>
			<span className="flex items-center justify-center rounded-l-md bg-yellow-300 py-1 pl-0.5 pr-1">
				{addressStruct.prefix}
			</span>

			<span className="inline-flex bg-green-300">
				{addressStruct.fill.map((item) => (
					<span
						className="inline-flex items-center justify-center px-0.5 py-1"
						style={{
							borderLeft: 'solid 2px rgba(0,0,0,0.3)',
						}}
					>
						{item}
					</span>
				))}
			</span>

			<span
				className="bg-orange-300 px-0.5 py-1"
				style={{
					borderLeft: 'solid 2px rgba(0,0,0,0.3)',
				}}
			>
				{addressStruct.overflow === null ||
				addressStruct.overflow === undefined ? (
					<a
						href="#PAexplanationOverflow"
						className="inline-flex font-sans underline"
					>
						NO OF
					</a>
				) : (
					addressStruct.overflow
				)}
			</span>

			<span
				style={{
					borderLeft: 'solid 2px rgba(0,0,0,0.3)',
				}}
				className="flex items-center justify-center rounded-r-md bg-blue-300 py-1 pl-0.5 pr-1"
			>
				{addressStruct.checksum}
			</span>
		</span>

		<PALegend
			items={[
				{
					id: 'prefix',
					color: 'bg-yellow-300',
					title: 'Prefix of the Address',
					// description: `The prefix 'bc1q' is always the same, as this indicates a Bech32-Address.`,
					description: (
						<>
							The prefix{' '}
							<MarkedTextWithCopy clickToCopy>
								bc1q
							</MarkedTextWithCopy>{' '}
							consistently indicates a <Bech32AddressLink />.
						</>
					),
				},
				{
					id: 'fill',
					color: 'bg-green-300',
					title: 'Fill',
					description: generateFillDescription(addressStruct.fill),
				},
				{
					id: 'PAexplanationOverflow',
					color: 'bg-orange-300',
					title: 'Overflow',
					description: generateOverflowDescription(addressStruct),
				},
				{
					id: 'checksum',
					color: 'bg-blue-300',
					title: 'Checksum of the Address',
					description: (
						<>
							The generated checksum is{' '}
							<MarkedTextWithCopy clickToCopy>
								{addressStruct.checksum}
							</MarkedTextWithCopy>{' '}
							.
						</>
					),
				},
			]}
		/>
	</DropDownContent>
);

export default PAExplanationView;
