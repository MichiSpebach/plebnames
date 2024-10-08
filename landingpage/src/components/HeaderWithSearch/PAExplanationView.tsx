import { PlebAddressExplainedType } from '@/src/utils/explainPlebAddress';
import React from 'react';

/**
 * Some info which explains the structure of the pleb-address.
 */
const PAExplanationView: React.FC<PlebAddressExplainedType> = ({
	addressStruct,
	inputName,
	normalizedName,
	plebAddress,
}) => {
	return null;
	return (
		<div
			style={{
				overflowX: 'hidden',
				overflowWrap: 'break-word',
			}}
		>
			<h3>Structure of the PlebAddress</h3>
			<p>
				Your Input-Name:
				<span className="font-mono">'{inputName}'</span>
				<br />
				The Normalized-Name:
				<span className="font-mono">'{normalizedName}'</span>
			</p>

			<span>{plebAddress} </span>
			{addressStruct && (
				<span
					className="box-content inline-flex bg-white py-2 font-mono"
					style={{
						fontSize: '1rem',
						letterSpacing: '0.10rem',
					}}
				>
					<span className="bg-yellow-300 py-1">
						{addressStruct.prefix}
					</span>

					<span className="inline-flex bg-green-300">
						{addressStruct.fill.map((item, i, arr) => (
							<span
								className="inline-flex items-center justify-center"
								style={{
									marginLeft: '-2px',
									borderLeft: 'solid 2px rgba(0,0,0,0.2)',
									borderTop: 'solid 1px rgba(0,0,0,0.2)',
									borderBottom: 'solid 1px rgba(0,0,0,0.2)',
								}}
							>
								{item}
							</span>
						))}
					</span>

					<span
						className="bg-orange-300 py-1"
						style={{
							marginLeft: '-2px',
							borderLeft: 'solid 2px rgba(0,0,0,0.2)',
							borderTop: 'solid 1px rgba(0,0,0,0.2)',
							borderBottom: 'solid 1px rgba(0,0,0,0.2)',
						}}
					>
						{addressStruct.overflow === null ||
						addressStruct.overflow === undefined
							? ''
							: addressStruct.overflow}
					</span>

					<span className="bg-blue-300 py-1">
						{addressStruct.checksum}
					</span>
				</span>
			)}
		</div>
	);
};

export default PAExplanationView;
