import { activeArticlesAction } from '@/actions/article'
import React from 'react'
import { UserAvatar } from '../common/user-avatar'
import Link from 'next/link'
import { Flame, MessageCircle } from 'lucide-react'

export const ActiveArticles = async () => {
	const data = await activeArticlesAction()
	// console.log('ActiveArticles', data)
	return (
		<div className='page-card p-0'>
			<div className='card-header'>Active Articles</div>
			<div className='card-container'>
				{data.map(article => (
					<div
						key={article.slug}
						className='flex flex-col gap-y-2 border-b border-neutral-200 border-dashed pb-4'
					>
						<Link
							href={`/profile/${article.author.username}`}
							className='group/avatar flex items-center gap-x-2'
						>
							<UserAvatar size={6} user={article?.author} />
							<span className='text-sm text-nutral-500 group-hover/avatar:text-emerald-500'>
								{article.author.username}
							</span>
						</Link>
						<Link
							href={`/article/${article.slug}`}
							className='text-sm font-semibold text-neutral-500 hover:text-neutral-600 line-clamp-2'
						>
							{article.title}
						</Link>

						{/* <div className='flex items-center gap-x-4 text-sm'>
							<div className='flex items-center gap-x-1'>
								<Flame size={16} className='text-orange-500' />
								<span>{article.score}</span>
							</div>

							<Link
								href={`/article/${article.slug}#comments`}
								className='flex items-center gap-x-1'
							>
								<MessageCircle size={16} className='text-neutral-500' />
								{article.commentsCount}
							</Link>
						</div> */}
					</div>
				))}
			</div>
		</div>
	)
}
