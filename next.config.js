/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FIELDPULSE_API_KEY: process.env.FIELDPULSE_API_KEY || '',
    FIELDPULSE_BASE_URL: process.env.FIELDPULSE_BASE_URL || 'https://api.fieldpulse.com',
  },
}

module.exports = nextConfig
