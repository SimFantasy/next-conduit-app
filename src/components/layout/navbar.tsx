import { Menubar } from '@/components/layout/menubar'
import { UserButton } from '@/components/layout/user-button'

export const Navbar = () => {
	return (
		<div className='flex justify-end items-center gap-x-4'>
			<Menubar />
			<UserButton />
		</div>
	)
}
