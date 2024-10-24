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
			<div className="flex flex-row items-center">
				{isVisible ? (
					<IoIosArrowDropupCircle
						title={`Hide content`}
						className="aspect-square h-5 w-5 flex-shrink-0 transform hover:scale-105 hover:opacity-75"
						onClick={() => setIsVisible(false)}
					/>
				) : (
					<IoIosArrowDropdownCircle
						title={`Show content`}
						className={
							'aspect-square h-5 w-5 flex-shrink-0 transform hover:scale-105 hover:opacity-75'
						}
						onClick={() => setIsVisible(true)}
					/>
				)}

				<h3
					className="pl-2 text-xl font-bold"
					onClick={() => setIsVisible((v) => !v)}
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
