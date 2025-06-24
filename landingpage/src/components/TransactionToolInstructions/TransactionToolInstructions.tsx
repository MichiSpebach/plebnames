import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import './TransactionToolInstructions.css'

interface TransactionToolInstructionsProps {
	slides: {
		src: string
		alt: string
		thumbnailTitle: string
	}[]
}

export const TransactionToolInstructions: React.FC<TransactionToolInstructionsProps> = ({slides}) => {
	const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
	const [activeThumbIndex, setActiveThumbIndex] = useState(0)

	return (
		<div style={{ display: 'flex', maxHeight: 500}}>
			<Swiper
				onSwiper={setThumbsSwiper}
				direction="vertical"
				slidesPerView={4}
				spaceBetween={4}
				modules={[Thumbs]}
				className='hidden lg:block'
				style={{ marginRight: 4}}
			>
				{slides.map((slide, idx) => (
					<SwiperSlide key={slide.src} className='!h-auto'/*otherwise overriden by swiper*/ style={{maxWidth: 130, maxHeight: 120, cursor: 'pointer'}}>
						{`${idx+1}/${slides.length} ${slide.thumbnailTitle}`}
						<img
							src={slide.src}
							alt={slide.alt}
							className={activeThumbIndex === idx ? 'border-4 border-amber-500' : ''}
							style={{ borderRadius: 8 }}
						/>
					</SwiperSlide>
				))}
			</Swiper>
			<Swiper
				modules={[Navigation, Thumbs]}
				navigation
				thumbs={{ swiper: thumbsSwiper }}
				style={{ width: '100%' }}
				onSlideChange={(swiper) => setActiveThumbIndex(swiper.activeIndex)}
			>
				{slides.map((slide, idx) => (
					<SwiperSlide key={slide.src}>
						<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
							<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
								<div className='lg:hidden' style={{alignSelf: 'start'}}>
									{`${idx+1}/${slides.length} ${slide.thumbnailTitle}`}
								</div>
								<img
									src={slide.src}
									alt={slide.alt}
									style={{ minHeight: 0, maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }}
								/>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	)
}