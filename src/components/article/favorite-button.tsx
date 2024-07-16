'use client'
import { useState, useOptimistic } from 'react'
import { BookmarkCheckIcon, BookmarkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { swtichFavoriteAction } from '@/actions/article'

interface FavoriteButtonProps {
	slug: string
	favorited: boolean
	favoritesCount: number
	className?: string
	type?: 'list' | 'detail'
}

export const FavoriteButton = ({
	slug,
	favorited,
	favoritesCount,
	className,
	type = 'list'
}: FavoriteButtonProps) => {
	const [favoriteState, setFavoriteState] = useState({
		favoritesCount,
		favorited
	})

	const [optimsticFavorite, setOptimisticFavorite] = useOptimistic(
		favoriteState,
		(state, value) => ({
			favorited: !state.favorited,
			favoritesCount: state.favorited ? state.favoritesCount - 1 : state.favoritesCount + 1
		})
	)

	const handleFavoriteAction = async () => {
		setOptimisticFavorite('')
		try {
			swtichFavoriteAction(slug)
			setFavoriteState(state => ({
				favorited: !state.favorited,
				favoritesCount: state.favorited ? state.favoritesCount - 1 : state.favoritesCount + 1
			}))
		} catch (error) {
			console.log('Error while switching favorite', error)
		}
	}
	return (
		<form action={handleFavoriteAction}>
			<button
				className={cn(
					type === 'list' ? 'article-item-sub' : 'article-meta-button',
					favorited && 'active',
					className
				)}
			>
				{optimsticFavorite.favorited ? <BookmarkCheckIcon size={16} /> : <BookmarkIcon size={16} />}
				{optimsticFavorite.favoritesCount}
			</button>
		</form>
	)
}
