import { getArticleAction } from '@/actions/article'
import { EditorForm } from '@/components/editor/editor-form'

const UpdateArticlePage = async ({ params }: { params: { slug: string } }) => {
	const article = await getArticleAction(params.slug)
	if (!article) return null
	return <EditorForm slug={params.slug} initialValues={article} />
}

export default UpdateArticlePage
