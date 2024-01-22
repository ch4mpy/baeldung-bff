/** @type {import('next').NextConfig} */
const reverseProxyUri = 'https://localhost:7080';
const basePath = '/react-ui'
const baseUri = `${reverseProxyUri}${basePath}`;
const nextConfig = {
    basePath,
    assetPrefix: '/react-ui',
    publicRuntimeConfig: {
        reverseProxyUri,
        basePath,
        baseUri
    }
};

export default nextConfig