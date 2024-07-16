'use client'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog'

interface AlertModalProps {
	title: string
	description: string
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	loading?: boolean
}

export const AlertModal = ({
	title,
	description,
	isOpen,
	onClose,
	onConfirm,
	loading
}: AlertModalProps) => {
	const onChange = (ope: boolean) => {
		if (!open) {
			onClose()
		}
	}
	return (
		<AlertDialog open={isOpen} onOpenChange={onChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={loading} onClick={onClose}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction disabled={loading} onClick={onConfirm}>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
