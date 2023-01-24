/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		SERVER_HOSTNAME: process.env.SERVER_HOSTNAME,
		SERVER_PORT: process.env.SERVER_PORT,
	},
}

module.exports = nextConfig
