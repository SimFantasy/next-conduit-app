import { ActiveArticles } from '@/components/home/active-articles'
import { Banner } from '@/components/home/banner'
import { MainView } from '@/components/home/main-view'
import { PopluarTags } from '@/components/home/popluar-tags'

interface HomePageProps {
	searchParams: {
		tag?: string
		page?: string
		feed?: string
	}
}

const HomePage = ({ searchParams }: HomePageProps) => {
	const page = Number(searchParams.page) || 1
	const tag = searchParams.tag
	const feed = searchParams.feed
	return (
		<div className='flex flex-col'>
			<Banner />

			<div className='page-container flex justify-between gap-x-6 my-6'>
				<div className='flex-1 flex flex-col gap-y-4 w-full'>
					<MainView tag={tag} feed={feed} page={page} />
				</div>

				<div className='hidden lg:flex flex-col gap-y-4 w-80'>
					<ActiveArticles />

					<PopluarTags />
				</div>
			</div>
		</div>
	)
}

export default HomePage
