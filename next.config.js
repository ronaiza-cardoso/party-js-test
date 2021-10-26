const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; preload'
  },
  {
    key: 'X-XSS-protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
]

const nextConfig = {
  experimental: { esmExternals: true },
  async headers() {
    return [
      {
        headers: [...securityHeaders],
        source: '/(.*)'
      }
    ]
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  webpack: (webpackConfig) => {
    webpackConfig.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/@builder.io/partytown/lib/',
            to: path.join(__dirname, 'public', '~partytown')
          }
        ]
      })
    )

    return webpackConfig
  }
}

// module.exports = {
//   reactStrictMode: true
// }
module.exports = nextConfig
