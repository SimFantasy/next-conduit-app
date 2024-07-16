'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { Titlebar } from '@/components/common/titlebar'
import { Separator } from '@/components/ui/separator'

import { AlertCircle } from 'lucide-react'

import { ContentEditor } from '@/components/common/content-editor'
import { ImageUpload } from '@/components/common/image-upload'
import { TagInput } from '@/components/editor/tag-input'

import { articleSchema } from '@/lib/schemas'
import { IArticleResponse } from '@/lib/types'
import { createArticleAction, updateArticleAction } from '@/actions/article'

interface EditorFormProps {
	slug?: string
	initialValues?: IArticleResponse
}

export const EditorForm = ({ slug, initialValues }: EditorFormProps) => {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [error, setError] = useState('')

	const form = useForm<z.infer<typeof articleSchema>>({
		resolver: zodResolver(articleSchema),
		defaultValues: initialValues
			? initialValues
			: {
					title: '',
					description: '',
					body: '',
					tagList: [],
					media: []
			  }
	})

	const onSubmit = async (values: z.infer<typeof articleSchema>) => {
		// console.log('values', values)
		setError('')
		if (slug) {
			startTransition(() =>
				updateArticleAction(slug, values)
					.then(res => {
						toast.success('Article updated successfully')
						router.push(`/article/${res.slug}`)
					})
					.catch(err => {
						console.log('err', err)
						setError(err.message)
					})
			)
		} else {
			startTransition(() =>
				createArticleAction(values)
					.then(res => {
						toast.success('Article saved successfully')
						router.push(`/article/${res.slug}`)
					})
					.catch(err => {
						console.log('err', err)
						setError(err.message)
					})
			)
		}
	}

	return (
		<div className='page-card flex flex-col !p-0'>
			<Titlebar title={slug ? 'Edit Article' : 'New Article'} className='p-4' />

			<Separator />

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 p-6'>
					<FormField
						control={form.control}
						name='media'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Media</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value}
										onChange={url => field.onChange([...field.value, url])}
										onRemove={url => field.onChange(field.value.filter(u => u !== url))}
										disabled={isPending}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='grid grid-cols-1 md:grid-cols-2  gap-6'>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder='Title' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='tagList'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tags</FormLabel>
									<FormControl>
										<TagInput
											placeholder='Press Enter to add the tag'
											disabled={isPending}
											value={field.value}
											onChange={tag => field.onChange([...field.value, tag])}
											onRemove={tag => field.onChange(field.value.filter(t => t !== tag))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name='description'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea placeholder='Description' {...field} rows={4}></Textarea>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='body'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Content</FormLabel>
								<FormControl>
									<ContentEditor value={field.value} onChange={field.onChange} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='flex justify-between items-center pt-6 border-t '>
						<div className='flex-1 flex items-center'>
							{error && (
								<div className='flex items-center gap-x-2 text-red-500 text-sm'>
									<AlertCircle size={16} />
									{error}
								</div>
							)}
						</div>
						<div className='flex justify-end items-center gap-x-4'>
							<Button type='button' variant='outline' onClick={() => router.back()}>
								Cancel
							</Button>
							<Button type='submit' disabled={isPending}>
								{slug
									? isPending
										? 'Saving...'
										: 'Update Article'
									: isPending
									? 'Publishing...'
									: 'Publish Article'}
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	)
}
