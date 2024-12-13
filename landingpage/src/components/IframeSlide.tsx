import React from 'react';

interface IframeSlideProps {
	src?: string;
	title?: string;
	aspectRatio?: number;
}

const IframeSlide: React.FC<IframeSlideProps> = ({
	src = '/slides_deck/index.html?postMessageEvents=true', // it's inside of the public folder
	title = 'Pleb Names Presentation',
	aspectRatio = 960 / 700,
}) => {
	return (
		<div className="relative rounded-[16px] bg-gradient-to-r from-blue-500 to-indigo-600 p-[2px]">
			<div className="absolute inset-0 rounded-[16px] bg-gradient-to-r from-blue-500 to-indigo-600 opacity-50 blur-md" />
			<div className="relative overflow-hidden rounded-[14px]">
				<iframe
					src={src}
					title={title}
					className="max-h-[85vh] w-full auto bg-black"
					style={{ aspectRatio }}
					allowFullScreen
				/>
			</div>
		</div>
	);
};

export default IframeSlide;
