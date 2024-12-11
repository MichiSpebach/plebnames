import React from 'react';
import { LuChevronDown } from 'react-icons/lu';
const DownIcon = LuChevronDown;

/**
 * A button component that smoothly scrolls to the next section of the page when clicked.
 * It only renders if `isVisible` is true.
 */
const ScrollToNextSectionButton: React.FC<{
	/** html element id to which we scroll */
	to: string;
	/** only renders if true */
	isVisible: boolean;
}> = ({ to, isVisible }) => {
	if (!isVisible) return null;

	const scrollToNextSection = () => {
		const nextSection = document.getElementById(to);
		if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<div className="absolute bottom-4 flex justify-center">
			<button
				onClick={scrollToNextSection}
				className="animate-bounce self-center rounded-full bg-white bg-opacity-20 p-2 transition-all duration-300 hover:bg-opacity-30 focus:outline-none"
				aria-label="Scroll to next section"
			>
				<span className="flex items-center px-4">
					<DownIcon className="text-white mr-2" size={24} />
					<div>Learn more</div>
				</span>
			</button>
		</div>
	);
};

export default ScrollToNextSectionButton;
