# Next.js 15 + React 19 + Prisma + Sqlite + Shadcn-ui + Typescript

终于吃上新鲜货了，项目用上了 React 19 的 `useActionState`、`useFormStatus`、`useOptimistic`新特性。Next.js 15 没有默认缓存也是好用，不用像 14 那样写一堆取消缓存的代码，才能看到效果。。除了登录因为用到了`next-auth`，使用了`api`的方式，其他的查询和请求都使用的是`action`的方式。

在 Realworld 的基础上，增加了些自己的想法：

- 给文章加了一套简单的评分系统。

- 按自己的想法完全修改了原来项目的 UI 风格，增加了响应式布局。

- 增加了文章的搜索功能。

- 基于 Shadcn-ui 的 form 组件，增加了文章的 Media 图片上传、封装了文章的标签功能。

- 使用问了文本编辑器`@uiw/react-markdown-editor`作为文章的编辑器，同时使用了该编辑器自带的`Markdown`预览作为文章内容的展示。

踩坑：

- Next.js 15 还是 rc 的版本，有些组件、插件的安装在项目运行时会报错，可以尝试取消项目运行，安装就可以避免一些报错的问题。

- 使用`useOptimistic`时，同一个组件的状态在页面上展示两个时，只会影响到发生交互的那个组件，其他组件的状态在刷新页面前不会更新。如：文章详情页面的关注和收藏。尽量不要在同一个页面上出现重复的组件。

- Next.js 中的`useSearchParams`方法的`set`方法，已经废弃了，官方使用原生的`JavaScript`方法`new URLSearchParams`来操作`URL`中的`search`参数。[官方示例](https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams)
