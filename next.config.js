/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    disableStaticImages: true, // <-- این خط رو اضافه کن
  },
  trailingSlash: true,
  reactStrictMode: true,
}

module.exports = nextConfig