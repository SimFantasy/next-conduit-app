import { redirect } from 'next/navigation'
import { ProfileBanner } from '@/components/profile/profile-banner'
import { ProfileMainView } from '@/components/profile/profile-mainview'

import { getUserProfile } from '@/actions/user'

interface ProfilePageProps {
	params: {
		username: string
	}
	searchParams: {
		tab?: 'my' | 'favorited'
		page?: string
	}
}

const ProfilePage = async ({ params, searchParams }: ProfilePageProps) => {
	const profile = await getUserProfile(params.username)
	if (!profile) redirect('/')

	const tab = searchParams.tab || 'my'
	const page = Number(searchParams.page) || 1
	return (
		<div className='flex flex-col gap-y-6'>
			<ProfileBanner profile={profile} />

			<ProfileMainView tab={tab} page={page} username={profile.username} />
		</div>
	)
}

export default ProfilePage
