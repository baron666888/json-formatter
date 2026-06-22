<script setup lang="ts">
import { ref } from 'vue'
import { type Locale } from '~/composables/useI18n'

const currentLocale = inject<Ref<Locale>>('currentLocale', ref('en'))
const tFn = inject<(key: string) => string>('t', (k: string) => k)
const t = (key: string) => tFn(key)

usePageMeta({
  titleKey: 'jsonGuideTitle',
  descKey: 'metaDescJsonGuide',
  t,
  currentLocale,
  path: '/json-guide'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': t('jsonGuideTitle'),
        'description': t('metaDescJsonGuide'),
        'url': 'https://json.znow-ai.com/json-guide',
        'publisher': { '@type': 'Organization', 'name': 'JSON Formatter' },
        'mainEntityOfPage': 'https://json.znow-ai.com/json-guide'
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
          { '@type': 'ListItem', 'position': 3, 'name': t('navJsonGuide'), 'item': 'https://json.znow-ai.com/json-guide' }
        ]
      })
    }
  ]
})
</script>

<template>
  <div class="content-page">
    <div class="content-container article">
      <h1 class="page-title">{{ t('jsonGuideTitle') }}</h1>
      <p class="page-intro">{{ t('jsonGuideIntro') }}</p>

      <section class="content-section">
        <h2>{{ t('jsonGuideS1Title') }}</h2>
        <p>{{ t('jsonGuideS1Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonGuideS2Title') }}</h2>
        <p>{{ t('jsonGuideS2Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonGuideS3Title') }}</h2>
        <p>{{ t('jsonGuideS3Text') }}</p>
        <div class="code-block">{{ t('jsonGuideS3Example') }}</div>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonGuideS4Title') }}</h2>
        <p>{{ t('jsonGuideS4Text') }}</p>
        <div class="code-block">{{ t('jsonGuideS4Example') }}</div>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonGuideS5Title') }}</h2>
        <p>{{ t('jsonGuideS5Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonGuideS6Title') }}</h2>
        <p>{{ t('jsonGuideS6Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonGuideS7Title') }}</h2>
        <p>{{ t('jsonGuideS7Text') }}</p>
      </section>

      <div class="tip-box">
        <NuxtLink to="/" class="btn btn-primary">{{ t('appTitle') }}</NuxtLink>
      </div>
    </div>
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

.tip-box {
  margin-top: 2rem;
  text-align: center;
}

.tip-box .btn {
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.65rem 1.5rem;
}
</style>
