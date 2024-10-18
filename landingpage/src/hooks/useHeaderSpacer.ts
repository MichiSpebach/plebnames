import { useState, useEffect, RefObject } from 'react';
import { throttle } from 'lodash';

/**
 * This hook calculates the height of a spacer element based on the height of the viewport and the height of the lvh element.
 * It also determines if the header fits within the available space.
 * @param ref RefObject to the header element
 * @param dependencies Array of dependencies, which would trigger a recalculation when changed.
 * @returns An object containing the spacer height and whether the header fits
 */
const useHeaderSpacer = (
	ref: RefObject<HTMLDivElement>,
	dependencies: unknown[] = [],
): { spacerHeight: number; fitsInHeader: boolean } => {
	const [spacerHeight, setSpacerHeight] = useState<number>(0);
	const [fitsInHeader, setFitsInHeader] = useState<boolean>(true);

	const minimumSpaceForFit = 74; // Minimum space required for the ScrollDownElement to fit

	useEffect(() => {
		const updateHeaderSpacerInfo = () => {
			const rc = ref.current;
			if (!rc) return;

			const rect = rc.getBoundingClientRect();
			const yPosition = rect.top + window.scrollY; // Y position relative to the page

			// Get the height of the lvh element
			const lvhElement = document.querySelector('.h-lvh');
			let windowHeight: number = window.innerHeight;
			if (lvhElement !== null) {
				windowHeight = parseFloat(
					window.getComputedStyle(lvhElement).height,
				);
			}

			const remainingSpace = windowHeight - yPosition;
			const h = rc.offsetHeight - remainingSpace;

			setSpacerHeight(h > 0 ? h + 32 : 0); // 32px is like a bottom margin.

			const diff = remainingSpace - rc.offsetHeight;
			setFitsInHeader(diff >= minimumSpaceForFit);
		};

		// Throttle the resize event to avoid excessive recalculations
		const throttledUpdate = throttle(updateHeaderSpacerInfo, 100, {
			leading: true, // Call immediately when the event starts
			trailing: true, // Ensure the last call happens when the user stops resizing
		});

		// Call initially to set the spacer height and fits status
		throttledUpdate();

		window.addEventListener('resize', throttledUpdate);
		const resizeObserver = new ResizeObserver(() => {
			throttledUpdate();
		});

		if (ref.current) resizeObserver.observe(ref.current);

		return () => {
			window.removeEventListener('resize', throttledUpdate);
			if (ref.current) resizeObserver.unobserve(ref.current);
			throttledUpdate.cancel();
		};
	}, [ref.current, ...dependencies]);

	return { spacerHeight, fitsInHeader };
};

export default useHeaderSpacer;
