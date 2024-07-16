import Link from 'next/link'
import Image from 'next/image'
import { MessageCircleIcon } from 'lucide-react'
import { IArticleResponse } from '@/lib/types'
import { formatRelativeDate } from '@/lib/utils'

import { QueryLink } from '@/components/common/query-link'
import { FavoriteButton } from './favorite-button'
import { UserAvatar } from '../common/user-avatar'

export const ArticleItem = ({ article }: { article: IArticleResponse }) => {
	return (
		<div className='flex justify-between items-start gap-x-4 pb-4 border-b border-neutral-200'>
			<div className='flex-1 flex flex-col'>
				<div className='flex items-center gap-x-4'>
					<Link
						href={`/profile/${article.author.username}`}
						className='group/avatar flex items-center gap-x-2'
					>
						<UserAvatar size={6} user={article?.author} />
						<span className='text-sm text-neutral-500 group-hover/avatar:text-emerald-500'>
							{article.author.username}
						</span>
					</Link>
					<span className='text-sm text-neutral-500'>
						Published at {formatRelativeDate(article.createdAt)}
					</span>
				</div>

				<Link
					href={`/article/${article.slug}`}
					className='my-2 text-2xl font-semibold text-gray-800 hover:text-emerald-500 line-clamp-2'
				>
					{article.title}
				</Link>

				<p className='text-base text-gray-500 line-clamp-4'>{article.description}</p>

				<div className='flex flex-col items-start md:flex-row justify-between md:items-center gap-y-2 md:gap-x-4 mt-6'>
					<div className='flex items-center gap-x-4'>
						<span className='article-item-sub'>{formatRelativeDate(article.createdAt)}</span>

						<Link href={`/article/${article.slug}#comments`} className='article-item-sub'>
							<MessageCircleIcon size={16} />
							{article.commentsCount}
						</Link>

						<FavoriteButton
							favorited={article.favorited}
							favoritesCount={article.favoritesCount}
							slug={article.slug}
							className=''
						/>
					</div>

					<div className='flex justify-end items-center gap-x-2'>
						{article.tagList.map(tag => (
							<QueryLink key={tag} reserved query={{ tag }} className='article-item-sub-tag '>
								{tag}
							</QueryLink>
						))}
					</div>
				</div>
			</div>

			{article.media.length > 0 && (
				<div className='hidden md:block relative w-60 h-40'>
					<Image
						src={article.media[0]}
						alt=''
						fill
						priority
						sizes='(min-width: 768px) 33vw, 100vw'
						className='object-cover rounded-md'
					/>
				</div>
			)}
		</div>
	)
}
