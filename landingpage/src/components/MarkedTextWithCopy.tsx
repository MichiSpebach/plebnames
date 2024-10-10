import React, { useCallback, useState } from 'react';
import { LuCheck as Check, LuCopy as Copy } from 'react-icons/lu';

/**
 * MarkedTextWithCopy Component
 *
 * Displays text wrapped in a styled `<mark>` element with optional "click to copy" functionality.
 *
 * Props:
 * - `children`: The text or content to display (ReactNode).
 * - `clickToCopy`: Enables copy-to-clipboard functionality when true, specifying this prop is required.
 *
 * Behavior:
 * - When `clickToCopy` is true, clicking the text copies it to the clipboard.
 * - Shows a checkmark when text is copied, otherwise a copy icon.
 * - Copy feedback lasts for 2 seconds after copying.
 *
 * @example
 * ```tsx
 * <MarkedTextWithCopy clickToCopy>Sample Text</MarkedTextWithCopy>
 * <MarkedTextWithCopy clickToCopy={false}>Sample Text which can not be copied</MarkedTextWithCopy>
 * ```
 */
const MarkedTextWithCopy: React.FC<{
	clickToCopy: boolean;
	children: React.ReactNode;
}> = ({ children, clickToCopy }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(() => {
		const text = typeof children === 'string' ? children : '';
		navigator.clipboard.writeText(text).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	}, [children]);

	return (
		<mark
			className="group relative inline-block max-w-full cursor-pointer items-center break-words rounded border border-gray-200 bg-blue-950/5 px-1 py-0.5 font-mono text-blue-950/85 transition hover:border-gray-300 hover:shadow-sm"
			onClick={clickToCopy ? handleCopy : undefined}
			style={{
				wordBreak: 'break-all',
			}}
		>
			{children}
			{clickToCopy && (
				<span className="inline-flex items-center justify-center pl-2 align-middle text-sm">
					{copied ? (
						<Check className="text-green-500" aria-hidden="true" />
					) : (
						<Copy
							className="text-gray-500 group-hover:text-blue-500"
							aria-hidden="true"
						/>
					)}
				</span>
			)}
		</mark>
	);
};

export default MarkedTextWithCopy;
