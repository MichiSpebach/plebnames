import React from 'react';
import { TbArrowBigDownLines, TbArrowBigDownLinesFilled } from 'react-icons/tb';
const DownIcon = TbArrowBigDownLines;
const DownIconFilled = TbArrowBigDownLinesFilled;

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
				className="group animate-bounce self-center rounded-full bg-white bg-opacity-20 p-2 transition-all duration-300 hover:bg-opacity-30 focus:outline-none"
				aria-label="Scroll to next section"
			>
				<span className="flex items-center space-x-2 px-4">
					<span className="text-base text-white lg:text-lg">
						<DownIconFilled className="group-hover:hidden" />
						<DownIcon className="hidden group-hover:inline" />
					</span>
					<div className="text-base text-white lg:text-lg">
						Learn more
					</div>
				</span>
			</button>
		</div>
	);
};

export default ScrollToNextSectionButton;
