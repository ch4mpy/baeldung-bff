/** @type {import('next').NextConfig} */
const basePath = '/react-ui'
const nextConfig = {
    basePath,
    assetPrefix: '/react-ui',
    publicRuntimeConfig: {
        basePath
    }
};

export default nextConfig