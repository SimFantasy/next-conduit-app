'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TrashIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { deleteArticleAction } from '@/actions/article'
import { AlertModal } from '@/components/common/alert-modal'
import { set } from 'zod'

interface DeleteButtonProps {
	slug: string
	className?: string
}

export const DeleteButton = ({ slug, className }: DeleteButtonProps) => {
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const handleDelete = async () => {
		try {
			setLoading(true)
			const result = await deleteArticleAction(slug)
			if (result.success) {
				toast.success('Article deleted successfully')
				router.push('/')
			}
			setLoading(false)
		} catch (error) {
			setLoading(false)
			console.log('article delete error', error)
		} finally {
			setOpen(false)
			setLoading(false)
		}
	}
	return (
		<>
			<button className={cn('article-meta-button', className)} onClick={() => setOpen(true)}>
				<TrashIcon size={16} />
				<span>Delete Article</span>
			</button>

			<AlertModal
				title='Delete Article'
				description='Are you sure you want to delete this article?'
				isOpen={open}
				onConfirm={handleDelete}
				onClose={() => setOpen(false)}
			/>
		</>
	)
}
