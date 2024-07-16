/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		reactCompiler: true
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com'
			}
		]
	}
}

export default nextConfig
