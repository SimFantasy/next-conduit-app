'use client'

import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'

import { ImagePlus, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { useMounted } from '@/hooks/use-mounted'

interface ImageUploadProps {
	disabled?: boolean
	onChange: (value: string) => void
	onRemove: (value: string) => void
	value: string[]
	single?: boolean
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
	disabled,
	onChange,
	onRemove,
	value,
	single = false
}) => {
	const mounted = useMounted()

	const onUpload = (result: any) => {
		onChange(result.info.secure_url)
	}

	if (!mounted) return null

	return (
		<div className='flex items-center gap-4'>
			<div className='flex items-center gap-4'>
				{value.map(url => (
					<div
						key={url}
						className='relative w-20 md:w-40 h-20 md:h-40 rounded-md border overflow-hidden'
					>
						<div className='z-10 absolute top-1 right-1'>
							<Button
								type='button'
								variant='destructive'
								size='icon'
								onClick={() => onRemove(url)}
								className='!h-auto !w-auto p-2'
							>
								<Trash size={16} />
							</Button>
						</div>
						<Image
							fill
							className='object-cover'
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							src={url}
							alt='Image'
						/>
					</div>
				))}
			</div>
			{!single || value.length === 0 || (single && value.length > 0 && value[0] === null) ? (
				<CldUploadWidget onUpload={onUpload} uploadPreset='conduit'>
					{({ open }) => {
						const onClick = () => {
							open()
						}
						return (
							<Button
								type='button'
								variant='outline'
								disabled={disabled}
								onClick={onClick}
								className='!m-0 w-20 md:w-40 h-20 md:h-40 flex-col'
							>
								<ImagePlus size={24} strokeWidth={1} />
							</Button>
						)
					}}
				</CldUploadWidget>
			) : null}
		</div>
	)
}
