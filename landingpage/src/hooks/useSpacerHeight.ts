import { useState, useEffect, RefObject } from 'react';
import { throttle } from 'lodash';

/**
 * This hook calculates the height of a spacer element based on the height of the viewport and the height of the lvh element.
 * @param ref
 * @param dependencies Array of dependencies, which would trigger by change a recalculation.
 */
const useSpacerHeight = (
	ref: RefObject<HTMLDivElement>,
	dependencies: unknown[] = [],
): number => {
	const [spacerHeight, setSpacerHeight] = useState<number>(0);

	useEffect(() => {
		const updateSpacerHeight = () => {
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

			const h = rc.offsetHeight - (windowHeight - yPosition);
			setSpacerHeight(h > 0 ? h + 32 : 0); // 32px is like a bottom margin.
		};

		// Throttle the resize event to avoid excessive recalculations
		const throttledUpdate = throttle(updateSpacerHeight, 100, {
			leading: true, // Call immediately when the event starts
			trailing: true, // Ensure the last call happens when the user stops resizing
		});

		// Call initially to set the spacer height
		throttledUpdate();

		window.addEventListener('resize', throttledUpdate);

		const resizeObserver = new ResizeObserver(() => {
			throttledUpdate();
		});

		if (ref.current) resizeObserver.observe(ref.current);

		return () => {
			window.removeEventListener('resize', throttledUpdate);
			ref.current?.removeEventListener(
				'transitionstart',
				throttledUpdate,
			);

			if (ref.current) resizeObserver.unobserve(ref.current);

			throttledUpdate.cancel();
		};
	}, [ref.current, ...dependencies]);

	return spacerHeight;
};

export default useSpacerHeight;
