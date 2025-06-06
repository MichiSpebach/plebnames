import React, { useState } from 'react';
import {
	IoIosArrowDropdownCircle,
	IoIosArrowDropupCircle,
} from 'react-icons/io';

/**
 * DropDownContent Component
 *
 * A collapsible section with a title. Clicking the title or arrow toggles the
 * visibility of the content.
 *
 * Props:
 * - `title`: The title displayed in the header (ReactNode).
 * - `children`: Content shown/hidden based on the toggle state (ReactNode).
 *
 * Behavior:
 * - Displays a down arrow when content is hidden, up arrow when visible.
 * - Clicking the title or arrow toggles content visibility.
 *
 * @example
 * ```tsx
 * <DropDownContent title="More Info">
 *   <p>Hidden content here.</p>
 * </DropDownContent>
 * ```
 */
function DropDownContent({
	title,
	children,
	expanded,
}: {
	/** The title to display */
	title: React.ReactNode;
	/** Content to hide/display */
	children: React.ReactNode;
	/** true if content is initially expanded/visible */
	expanded?: boolean;
}) {
	const [isVisible, setIsVisible] = useState(expanded);

	return (
		<div
			className="flex flex-col text-blue-950"
			style={{
				overflowX: 'hidden',
				overflowWrap: 'break-word',
			}}
		>
			<div
				className="flex flex-row items-center flex-shrink-0 transform hover:text-amber-500"
				style={{
					cursor: 'pointer'
				}}
				onClick={() => setIsVisible((v) => !v)}
			>
				{isVisible ? (
					<IoIosArrowDropupCircle
						title={`Hide content`}
						className="aspect-square h-6 w-6"
					/>
				) : (
					<IoIosArrowDropdownCircle
						title={`Show content`}
						className="aspect-square h-6 w-6"
					/>
				)}

				<h3
					className="pl-2 text-xl font-bold"
				>
					{title}
				</h3>
			</div>

			<div
				style={{ display: isVisible ? undefined : 'none' }}
				className="mt-6 flex flex-col"
			>
				{children}
			</div>
		</div>
	);
}

export default DropDownContent;
