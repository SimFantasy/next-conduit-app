'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { PencilIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { FollowButton } from '@/components/article/follow-button'
import { FavoriteButton } from '@/components/article/favorite-button'
import { DeleteButton } from '@/components/article/delete-button'
import { UserAvatar } from '@/components/common/user-avatar'

import { useAuth } from '@/hooks/use-auth'
import { IArticleResponse } from '@/lib/types'
import { cn, formatRelativeDate } from '@/lib/utils'
import { clickArticleAction } from '@/actions/article'

interface ArticleDetailMetaProps {
	article: IArticleResponse
	className?: string
}

export const ArticleDetailMeta = ({ article, className }: ArticleDetailMetaProps) => {
	const authUser = useAuth(state => state.authUser)
	const isAuthor = authUser.id === article.author.id

	useEffect(() => {
		clickArticleAction(article.slug)
	}, [article.slug])
	return (
		<div className='flex items-center gap-x-4 py-4'>
			<div className='flex items-center gap-x-2'>
				<UserAvatar size={10} user={article?.author} />

				<div className='flex flex-col'>
					<Link
						href={`/profile/${article.author.username}`}
						className={cn(className === 'dark' ? 'text-gray-900' : 'text-white')}
					>
						{article.author.username}
					</Link>
					<span
						className={cn('text-xs', className === 'dark' ? 'text-gray-500' : 'text-emerald-100')}
					>
						{formatRelativeDate(article.createdAt)}
					</span>
				</div>
			</div>

			{isAuthor ? (
				<>
					<Link href={`/editor/${article.slug}`} className={cn('article-meta-button', className)}>
						<PencilIcon size={16} />
						<span>Edit Article</span>
					</Link>

					<DeleteButton slug={article.slug} className={className} />
				</>
			) : (
				<>
					<FollowButton
						username={article.author.username}
						following={article.author.following}
						className={className}
					/>
					<FavoriteButton
						type='detail'
						slug={article.slug}
						favorited={article.favorited}
						favoritesCount={article.favoritesCount}
						className={className}
					/>
				</>
			)}
		</div>
	)
}
