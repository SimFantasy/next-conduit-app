import { CirclePlus, Home, Key, Settings } from 'lucide-react'

export const menus = [
	{ label: 'Home', route: '/', icon: Home, hasAuth: false },
	{ label: 'Create Article', route: '/editor', icon: CirclePlus, hasAuth: true },
	{ label: 'Settings', route: '/settings', icon: Settings, hasAuth: true },
	{ label: 'Register', route: '/register', icon: Key, hasAuth: false },
	{ label: 'Login', route: '/login', icon: Key, hasAuth: false }
]

// 分页数
export const PAGE_SIZE = 10
export const ACTIVE_ARTICLES_LIMIT = 8
export const POPULAR_TAGS_LIMIT = 10

// 评分计数
export const CLICK_SCORE = 0.25
export const FAVORITE_SCORE = 3
export const COMMENT_SCORE = 5
