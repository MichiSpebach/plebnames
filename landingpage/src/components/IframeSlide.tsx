import React, { useEffect } from 'react';

interface IframeSlideProps {
	src?: string;
	title?: string;
	aspectRatio?: number;
	border?: boolean;
	id?: string;
	startSlide?: number;
}

const IframeSlide: React.FC<IframeSlideProps> = ({
	src = '/slides_deck/index.html?postMessageEvents=true', // it's inside of the public folder
	title = 'Pleb Names Presentation',
	aspectRatio = 960 / 700,
	border = true,
	startSlide = 1,
	id = "",
}) => {
	useEffect(() => {
		if (startSlide > 1) {
			const handleLoad = () => {
				const frame = document.getElementById(id) as HTMLIFrameElement;
				frame?.contentWindow?.postMessage(
					JSON.stringify({
						method: 'slide',
						args: [startSlide],
					}),
					'*',
				);
			};
			const frame = document.getElementById(id) as HTMLIFrameElement;
			frame?.addEventListener('load', handleLoad);
			return () => {
				frame?.removeEventListener('load', handleLoad);
			};
		}
	}, []);

	return (
		/* Outer wrapper: only handles padding and rounded corners! Fixes #30 */
		<div className="relative rounded-[16px] p-[2px]">
			{border && (
				<>
					{/* Sharp gradient border layer */}
					<div className="translate-z-0 pointer-events-none absolute inset-0 -z-10 rounded-[16px] bg-gradient-to-r from-blue-500 to-indigo-600 will-change-transform" />
					{/* Blurred glow effect */}
					<div className="translate-z-0 pointer-events-none absolute inset-0 -z-10 rounded-[16px] bg-gradient-to-r from-blue-500 to-indigo-600 opacity-50 blur-md will-change-transform" />
				</>
			)}

			{/* Actual content block with inner border radius */}
			<div className="relative z-10 overflow-hidden rounded-[14px]">
				<iframe
					id={id}
					src={src}
					title={title}
					className="max-h-[85vh] w-full bg-black"
					style={{ aspectRatio }}
					allowFullScreen
				/>
			</div>
		</div>
	);
};

export default IframeSlide;
