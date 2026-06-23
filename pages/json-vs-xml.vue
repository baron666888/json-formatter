<script setup lang="ts">
import { ref } from 'vue'
import { type Locale } from '~/composables/useI18n'

const currentLocale = inject<Ref<Locale>>('currentLocale', ref('en'))
const tFn = inject<(key: string) => string>('t', (k: string) => k)
const t = (key: string) => tFn(key)

usePageMeta({
  titleKey: 'jsonVsXmlTitle',
  descKey: 'metaDescJsonVsXml',
  t,
  currentLocale,
  path: '/json-vs-xml'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': t('jsonVsXmlTitle'),
        'description': t('metaDescJsonVsXml'),
        'url': 'https://json.znow-ai.com/json-vs-xml',
        'publisher': { '@type': 'Organization', 'name': 'JSON Formatter' },
        'mainEntityOfPage': 'https://json.znow-ai.com/json-vs-xml'
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': t('navHome'), 'item': 'https://json.znow-ai.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': t('navArticles'), 'item': 'https://json.znow-ai.com/' },
          { '@type': 'ListItem', 'position': 3, 'name': t('navJsonVsXml'), 'item': 'https://json.znow-ai.com/json-vs-xml' }
        ]
      })
    }
  ]
})
</script>

<template>
  <div class="content-page">
    <div class="content-container article">
      <h1 class="page-title">{{ t('jsonVsXmlTitle') }}</h1>
      <p class="page-intro">{{ t('jsonVsXmlIntro') }}</p>

      <section class="content-section">
        <h2>{{ t('jsonVsXmlS1Title') }}</h2>
        <p>{{ t('jsonVsXmlS1Text') }}</p>
        <div class="code-block">{{ t('jsonVsXmlS1Json') }}</div>
        <div class="code-block">{{ t('jsonVsXmlS1Xml') }}</div>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonVsXmlS2Title') }}</h2>
        <p>{{ t('jsonVsXmlS2Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonVsXmlS3Title') }}</h2>
        <p>{{ t('jsonVsXmlS3Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonVsXmlS4Title') }}</h2>
        <p>{{ t('jsonVsXmlS4Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonVsXmlS5Title') }}</h2>
        <p>{{ t('jsonVsXmlS5Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonVsXmlS6Title') }}</h2>
        <p>{{ t('jsonVsXmlS6Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonVsXmlS7Title') }}</h2>
        <p>{{ t('jsonVsXmlS7Text') }}</p>
      </section>
    </div>
    <ContentSidebarAd />
  </div>
</template>

<style scoped>
@import '~/assets/css/content-page.css';

.code-block {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  background: rgba(59, 130, 246, 0.06);
  border-left: 3px solid var(--color-primary);
  color: var(--color-text);
  overflow-x: auto;
}
</style>
