import React from 'react'

export const EmptyContent = ({ text }: { text: string }) => {
	return (
		<div className='flex justify-center items-center px-4 py-2 w-full text-sm text-gray-500 border border-dashed rounded-md'>
			{text}
		</div>
	)
}
