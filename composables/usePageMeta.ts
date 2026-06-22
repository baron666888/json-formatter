import { type Locale } from '~/composables/useI18n'

/**
 * Escape special characters for safe use in HTML meta content attributes.
 * Handles CJK full-width punctuation, quotes, ampersands, etc.
 */
function escapeMetaContent(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

interface PageMetaOptions {
  titleKey: string
  descKey: string
  t: (key: string) => string
  currentLocale: Ref<Locale>
  path: string
}

export function usePageMeta({ titleKey, descKey, t, currentLocale, path }: PageMetaOptions) {
  const siteUrl = 'https://json.znow-ai.com'

  useHead({
    title: () => t(titleKey),
    meta: [
      {
        name: 'description',
        content: () => escapeMetaContent(t(descKey))
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `${siteUrl}${path}` },
      { property: 'og:title', content: () => escapeMetaContent(t(titleKey)) },
      { property: 'og:description', content: () => escapeMetaContent(t(descKey)) },
      { property: 'og:image', content: `${siteUrl}/og-image.png` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:locale', content: () => localeToOgLocale(currentLocale.value) },
      { property: 'og:site_name', content: 'JSON Formatter' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: `${siteUrl}${path}` },
      { name: 'twitter:title', content: () => escapeMetaContent(t(titleKey)) },
      { name: 'twitter:description', content: () => escapeMetaContent(t(descKey)) },
      { name: 'twitter:image', content: `${siteUrl}/og-image.png` },
    ],
    link: [
      { rel: 'canonical', href: `${siteUrl}${path}` }
    ]
  })
}

function localeToOgLocale(locale: string): string {
  const map: Record<string, string> = {
    en: 'en_US',
    zh: 'zh_CN',
    ja: 'ja_JP'
  }
  return map[locale] || 'en_US'
}
