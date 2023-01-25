/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		SERVER_DOMAIN: process.env.SERVER_DOMAIN,
		SERVER_HTTP_PROTOCOL: process.env.SERVER_HTTP_PROTOCOL,
		SERVER_SOCKET_URI: process.env.SERVER_SOCKET_URI,
	},
}

module.exports = nextConfig
