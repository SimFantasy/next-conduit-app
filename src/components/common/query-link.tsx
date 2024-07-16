'use client'

import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'

import { useSearchParams } from 'next/navigation'
import React from 'react'

interface QueryLinkProps extends Omit<LinkProps, 'href' | 'locale'> {
	query: Record<string, string | number | undefined>
	children: React.ReactNode
	className?: string
	reserved?: boolean
	noSearch?: boolean
}

export const QueryLink = ({
	reserved = false,
	noSearch = false,
	query,
	children,
	...props
}: QueryLinkProps) => {
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const currentQuery = reserved
		? Array.from(searchParams.entries()).reduce(
				(obj, [key, value]) => ({
					...obj,
					[key]: value
				}),
				{}
		  )
		: {}
	const finalQuery = { ...currentQuery, ...query }

	return (
		<Link href={{ pathname: noSearch ? pathname : '/search', query: { ...finalQuery } }} {...props}>
			{children}
		</Link>
	)
}
