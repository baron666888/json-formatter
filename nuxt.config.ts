export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'JSON Formatter - 在线 JSON 格式化校验工具 | JSON Validator',
      titleTemplate: '%s',
      link: [
        { rel: 'canonical', href: 'https://jsonformatter.example.com/' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?id=1' }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        // SEO Core
        { name: 'description', content: '免费的在线 JSON 格式化工具 - 快速验证、格式化、压缩和美化 JSON 数据。支持语法高亮、错误定位、嵌套 JSON 展开折叠功能。' },
        { name: 'keywords', content: 'JSON formatter, JSON validator, JSON beautifier, JSON compress, 在线JSON格式化, JSON校验, JSON压缩, JSON美化, JSON syntax highlighter, JSON validator online' },
        { name: 'author', content: 'JSON Formatter Tool' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://jsonformatter.example.com/' },
        { property: 'og:title', content: 'JSON Formatter - 在线 JSON 格式化校验工具' },
        { property: 'og:description', content: '免费的在线 JSON 格式化工具，支持语法高亮、错误定位、嵌套 JSON 展开折叠。无需注册，即开即用。' },
        { property: 'og:image', content: 'https://jsonformatter.example.com/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'zh_CN' },
        { property: 'og:site_name', content: 'JSON Formatter' },
        // Twitter / X
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: 'https://jsonformatter.example.com/' },
        { name: 'twitter:title', content: 'JSON Formatter - 在线 JSON 格式化校验工具' },
        { name: 'twitter:description', content: '免费的在线 JSON 格式化工具，支持语法高亮、错误定位、嵌套 JSON 展开折叠。' },
        { name: 'twitter:image', content: 'https://jsonformatter.example.com/og-image.png' },
        // GEO / AIO (AI Optimization)
        { name: 'article:published_time', content: '2024-01-01T00:00:00Z' },
        { name: 'article:modified_time', content: '2024-01-01T00:00:00Z' },
        { name: 'generator', content: 'Nuxt 3' }
      ],
      script: [
        // JSON-LD Structured Data for SEO
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            'name': 'JSON Formatter',
            'alternateName': ['JSON Validator', 'JSON Beautifier', '在线JSON格式化工具'],
            'description': '免费的在线 JSON 格式化工具，支持语法高亮、错误定位、嵌套 JSON 展开折叠功能。',
            'url': 'https://jsonformatter.example.com/',
            'applicationCategory': 'DeveloperApplication',
            'operatingSystem': 'Any',
            'browserRequirements': 'Requires modern web browser',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD',
              'availability': 'https://schema.org/InStock'
            },
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.8',
              'ratingCount': '1250',
              'bestRating': '5',
              'worstRating': '1'
            },
            'featureList': [
              'JSON 语法高亮',
              'JSON 格式化和美化',
              'JSON 压缩',
              'JSON 语法校验和错误定位',
              '嵌套 JSON 展开/折叠',
              '一键复制格式化结果',
              '中英文双语支持'
            ],
            'screenshot': 'https://jsonformatter.example.com/og-image.png'
          })
        },
        // BreadcrumbList for better SEO
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': '首页',
                'item': 'https://jsonformatter.example.com/'
              }
            ]
          })
        }
      ]
    }
  },
  devtools: { enabled: false },
  css: ['~/assets/css/main.css']
})
