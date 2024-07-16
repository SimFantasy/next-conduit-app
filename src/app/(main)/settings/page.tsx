import { SettingsForm } from '@/components/settings/settings-form'
import { Titlebar } from '@/components/common/titlebar'
import { getCurrentUser } from '@/actions/user'

const SettingsPage = async () => {
	const user = await getCurrentUser()
	if (!user) return null
	return (
		<div className='page-container w-full my-6'>
			<div className='page-card flex flex-col gap-y-6 p-0'>
				<div className='p-4 border-b border-neutral-200'>
					<Titlebar title='Settings' />
				</div>
				<SettingsForm user={user} />
			</div>
		</div>
	)
}

export default SettingsPage
