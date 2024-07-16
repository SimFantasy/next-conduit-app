import { NextRequest, NextResponse } from 'next/server'
import {
	DEFAULT_LOGIN_REDIRECT,
	apiAuthPrefix,
	authRoutes,
	publicRoutes
} from '@/lib/auth/auth-routes'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
	const { nextUrl } = req
	const token = await getToken({
		req,
		secret: process.env.NEXTAUTH_JWT_SECRET
	})
	const isLoggedIn = !!token

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
	const isAuthRoute = authRoutes.includes(nextUrl.pathname)

	if (isApiAuthRoute) return null

	if (isAuthRoute) {
		if (isLoggedIn) {
			return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
		}
		return null
	}

	if (!isLoggedIn && !isPublicRoute) {
		return NextResponse.redirect(new URL('/login', nextUrl))
	}

	return null
}

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
