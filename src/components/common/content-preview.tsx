'use client'

import MarkdownEditor from '@uiw/react-markdown-editor'
import { useMounted } from '@/hooks/use-mounted'

export const ContentPreview = ({ content }: { content: string }) => {
	const mounted = useMounted()

	if (!mounted) return null
	return (
		<article className='wmde-markdown-var'>
			<MarkdownEditor.Markdown
				source={content}
				// style={{ backgroundColor: 'transparent' }}
				className='!bg-transparent text-gray-800 dark:text-gray-300'
				style={{ padding: 16 }}
				rehypeRewrite={(node: any, index, parent: any) => {
					if (node.tagName === 'a' && parent && /^h(1|2|3|4|5|6)/.test(parent.tagName)) {
						parent.children = parent.children.slice(1)
					}
				}}
			/>
		</article>
	)
}
