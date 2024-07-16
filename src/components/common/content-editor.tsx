'use client'

import MarkdownEditor from '@uiw/react-markdown-editor'
import '@uiw/react-markdown-editor/markdown-editor.css'

import { useMounted } from '@/hooks/use-mounted'

interface ContentEditorProps {
	value: string
	onChange: (value: string) => void
}

export const ContentEditor = ({ value, onChange }: ContentEditorProps) => {
	const mounted = useMounted()
	if (!mounted) return null

	return <MarkdownEditor height='400px' value={value} onChange={onChange} />
}
