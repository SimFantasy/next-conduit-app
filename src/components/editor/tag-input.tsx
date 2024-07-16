'use client'

import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

interface TagInputProps {
	disabled?: boolean
	placeholder?: string
	value: string[]
	onChange: (tags: string) => void
	onRemove: (tag: string) => void
}

export const TagInput = ({ disabled, placeholder, value, onChange, onRemove }: TagInputProps) => {
	const [inputValue, setInputValue] = useState('')

	const addValue = (item: string) => {
		onChange(item)
		setInputValue('')
	}
	return (
		<div className='flex flex-col gap-y-2'>
			<Input
				placeholder={placeholder}
				value={inputValue}
				onChange={e => setInputValue(e.target.value)}
				onKeyDown={e => {
					if (e.key === 'Enter') {
						e.preventDefault()
						addValue(inputValue)
					}
				}}
				disabled={disabled}
			/>

			<div className='flex gap-1 flex-wrap'>
				{value.map((item, index) => (
					<div
						key={index}
						className='flex items-center gap-x-2 bg-gray-100 rounded-md pl-2 pr-1 py-1 text-sm text-gray-500'
					>
						{item}

						<button
							type='button'
							className='p-1 bg-transparent hover:bg-gray-300 border-none outline-none rounded-md text-xs text-gray-500 hover:text-gray-700'
							onClick={() => onRemove(item)}
						>
							<X size={12} />
						</button>
					</div>
				))}
			</div>
		</div>
	)
}
