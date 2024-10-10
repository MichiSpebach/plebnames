import React from 'react';

export type PALegendProps = {
	items: Array<{
		/** for Scroll-to and later we might use it for a hover-sync Animationen */
		id: string;

		color: string;

		/** Matching title for the color */
		title: string;

		/** description for the element */
		description: React.ReactNode;
	}>;
};

/**
 * A Legend for decoding the PlebAddress.
 */
const PALegend: React.FC<PALegendProps> = ({ items }) => (
	// <span className="mb-2 mt-3 text-lg font-bold">Legend</span>
	<ul className="flex flex-col gap-y-4">
		{items.map((item) => (
			<li className="flex flex-col gap-y-1" id={item.id} key={item.id}>
				<span className="flex flex-row items-center gap-1 text-base font-bold">
					<div className={`${item.color} h-4 w-4 rounded-full`} />

					{item.title}
				</span>

				{item.description && (
					<p className="text-blue-950/85">{item.description}</p>
				)}
			</li>
		))}
	</ul>
);

export default PALegend;
