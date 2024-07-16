import { QueryLink } from '@/components/common/query-link'
import { PAGE_SIZE } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react'

export const Pagination = ({ count, page }: { count: number; page: number }) => {
	const totalPage = Math.ceil(count / PAGE_SIZE)

	// 计算需要显示的页码列表
	const pages = []
	if (totalPage <= 5) {
		for (let i = 1; i <= totalPage; i++) {
			pages.push(i)
		}
	} else {
		if (page <= 3) {
			for (let i = 1; i <= 5; i++) {
				pages.push(i)
			}
			pages.push('...')
			pages.push(totalPage)
		} else if (page >= totalPage - 2) {
			pages.push(1)
			pages.push('...')
			for (let i = totalPage - 4; i <= totalPage; i++) {
				pages.push(i)
			}
		} else {
			pages.push(1)
			pages.push('...')
			for (let i = page - 1; i <= page + 1; i++) {
				pages.push(i)
			}
			pages.push('...')
			pages.push(totalPage)
		}
	}
	return (
		<div className='flex items-center gap-x-2'>
			<QueryLink reserved query={{ page: 1 }} className='page-button'>
				<ChevronsLeftIcon size={16} />
			</QueryLink>
			{pages.map((p, index) => (
				<QueryLink
					key={index}
					reserved
					query={{ page: p }}
					className={cn('page-button', p === page && 'active')}
				>
					{p}
				</QueryLink>
			))}
			<QueryLink reserved query={{ page: totalPage }} className='page-button'>
				<ChevronsRightIcon size={16} />
			</QueryLink>
		</div>
	)
}
