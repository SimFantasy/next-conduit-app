import Image from 'next/image'

import { Logo } from '@/components/common/logo'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='flex justify-between items-stretch gap-x-6 w-screen h-screen'>
			<div className='relative hidden lg:block w-0 lg:w-1/2 h-full'>
				<Image
					src='/images/auth-image2.jpg'
					alt='auth-image'
					fill
					sizes='(max-width: 768px) 100vw, 100vw'
					priority
					className='object-cover object-bottom'
				/>
				<div className='absolute top-0 left-0 flex flex-col justify-between gap-y-6 p-6 w-full h-full bg-emerald-950/60 backdrop-blur-sm text-white'>
					<Logo size='lg' light />

					<div className='flex flex-col items-start gap-y-2'>
						<h1 className='text-xl'>&quot;Stay angled, stay focused &quot;</h1>
						<small className='text-sm'>--Steve Jobs</small>
					</div>
				</div>
			</div>
			<div className='flex justify-center items-center w-full h-full lg:w-1/2 px-4 md:px-6 lg:px-8'>
				{children}
			</div>
		</div>
	)
}

export default AuthLayout
