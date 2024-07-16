import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
	size?: number
	user: {
		username: string
		image: string
	}
	className?: string
}

export const UserAvatar = ({ size = 10, user, className }: UserAvatarProps) => {
	return (
		<Avatar className={cn(`h-${size} w-${size}`, className)}>
			<AvatarImage src={user?.image} alt={user?.username} />
			<AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
		</Avatar>
	)
}
