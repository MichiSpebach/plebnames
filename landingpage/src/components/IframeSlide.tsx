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
		<div
			className={`relative rounded-[16px] ${border ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : ''} p-[2px]`}
		>
			<div
				className={`absolute inset-0 rounded-[16px] ${border ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : ''}opacity-50 blur-md`}
			/>
			<div className="relative overflow-hidden rounded-[14px]">
				<iframe
					id={id}
					src={src}
					title={title}
					className="auto max-h-[85vh] w-full bg-black"
					style={{ aspectRatio }}
					allowFullScreen
				/>
			</div>
		</div>
	);
};

export default IframeSlide;
