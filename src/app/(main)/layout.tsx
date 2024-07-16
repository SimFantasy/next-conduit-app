import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='flex flex-col w-full h-full bg-neutral-100'>
			<Header />
			<main className='h-full min-h-[calc(100vh-56px)] lg:min-h-[calc(100vh-56px-48px)]'>
				{children}
			</main>
			<Footer />
		</div>
	)
}

export default MainLayout
