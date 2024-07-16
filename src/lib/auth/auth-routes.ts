/**
 * 公共路由、
 * 不需要验证身份
 * @type {string[]}
 */
export const publicRoutes = ['/']

/**
 * 需要验证身份的路由
 * 路由会将登录用户重定向到 /settings页面
 * @type {string[]}
 */
export const authRoutes = ['/login', '/register']

/**
 * 验证 API路由前缀
 * 以此前缀开头的路由用于API身份验证
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth'

/**
 * 登录后默认重定向路由
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/'
