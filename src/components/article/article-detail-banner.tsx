import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/components/ui/carousel'
import Image from 'next/image'

interface IArticleDetailBannerProps {
	title: string
	media: string[]
	children: React.ReactNode
}

export const ArticleDetailBanner = ({ title, media, children }: IArticleDetailBannerProps) => {
	return (
		<div className='relative w-full h-60 bg-emerald-950'>
			<Carousel className='absolute top-0 left-0 z-0 w-full h-full'>
				<CarouselContent>
					{media.map((img, index) => (
						<CarouselItem key={index}>
							<div className='relative w-full h-60'>
								<Image
									src={img}
									alt={title}
									fill
									sizes='(min-width: 768px) 50vw, 100vw'
									priority
									className='object-cover'
								/>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			<div className='absolute top-0 left-0 z-10 w-full h-full bg-emerald-950/80'>
				<div className='page-container h-full flex flex-col justify-center gap-y-2 text-white'>
					<div className='flex-grow flex items-center'>
						<h1 className='text-3xl font-semibold'>{title}</h1>
					</div>
					{children}
				</div>
			</div>
		</div>
	)
}
