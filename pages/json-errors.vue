<script setup lang="ts">
import { ref } from 'vue'
import { type Locale } from '~/composables/useI18n'

const currentLocale = inject<Ref<Locale>>('currentLocale', ref('en'))
const tFn = inject<(key: string) => string>('t', (k: string) => k)
const t = (key: string) => tFn(key)

usePageMeta({
  titleKey: 'jsonErrorsTitle',
  descKey: 'metaDescJsonErrors',
  t,
  currentLocale,
  path: '/json-errors'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': t('jsonErrorsTitle'),
        'description': t('metaDescJsonErrors'),
        'url': 'https://json.znow-ai.com/json-errors',
        'publisher': { '@type': 'Organization', 'name': 'JSON Formatter' },
        'mainEntityOfPage': 'https://json.znow-ai.com/json-errors'
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
          { '@type': 'ListItem', 'position': 3, 'name': t('navJsonErrors'), 'item': 'https://json.znow-ai.com/json-errors' }
        ]
      })
    }
  ]
})
</script>

<template>
  <div class="content-page">
    <div class="content-container article">
      <h1 class="page-title">{{ t('jsonErrorsTitle') }}</h1>
      <p class="page-intro">{{ t('jsonErrorsIntro') }}</p>

      <section class="content-section">
        <h2>{{ t('jsonErrorsS1Title') }}</h2>
        <p>{{ t('jsonErrorsS1Text') }}</p>
        <div class="code-block bad">{{ t('jsonErrorsS1Bad') }}</div>
        <div class="code-block good">{{ t('jsonErrorsS1Good') }}</div>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonErrorsS2Title') }}</h2>
        <p>{{ t('jsonErrorsS2Text') }}</p>
        <div class="code-block bad">{{ t('jsonErrorsS2Bad') }}</div>
        <div class="code-block good">{{ t('jsonErrorsS2Good') }}</div>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonErrorsS3Title') }}</h2>
        <p>{{ t('jsonErrorsS3Text') }}</p>
        <div class="code-block bad">{{ t('jsonErrorsS3Bad') }}</div>
        <div class="code-block good">{{ t('jsonErrorsS3Good') }}</div>
      </section>

      <InContentAd />

      <section class="content-section">
        <h2>{{ t('jsonErrorsS4Title') }}</h2>
        <p>{{ t('jsonErrorsS4Text') }}</p>
        <div class="code-block bad">{{ t('jsonErrorsS4Bad') }}</div>
        <div class="code-block good">{{ t('jsonErrorsS4Good') }}</div>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonErrorsS5Title') }}</h2>
        <p>{{ t('jsonErrorsS5Text') }}</p>
        <div class="code-block bad">{{ t('jsonErrorsS5Bad') }}</div>
        <div class="code-block good">{{ t('jsonErrorsS5Good') }}</div>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonErrorsS6Title') }}</h2>
        <p>{{ t('jsonErrorsS6Text') }}</p>
        <div class="code-block bad">{{ t('jsonErrorsS6Bad') }}</div>
        <div class="code-block good">{{ t('jsonErrorsS6Good') }}</div>
      </section>

      <section class="content-section">
        <h2>{{ t('jsonErrorsS7Title') }}</h2>
        <p>{{ t('jsonErrorsS7Text') }}</p>
        <div class="code-block bad">{{ t('jsonErrorsS7Bad') }}</div>
        <div class="code-block good">{{ t('jsonErrorsS7Good') }}</div>
      </section>

      <div class="tip-box">
        <h3>{{ t('jsonErrorsTipTitle') }}</h3>
        <p>{{ t('jsonErrorsTipText') }}</p>
        <NuxtLink to="/" class="btn btn-primary">{{ t('appTitle') }}</NuxtLink>
      </div>
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
  border-left: 3px solid;
  overflow-x: auto;
}

.code-block.bad {
  background: rgba(220, 38, 38, 0.06);
  border-color: #dc2626;
  color: #991b1b;
}

.code-block.good {
  background: rgba(5, 150, 105, 0.06);
  border-color: #059669;
  color: #065f46;
}

.tip-box {
  background: rgba(59, 130, 246, 0.06);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.tip-box h3 {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.tip-box p {
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: 1rem;
}

.tip-box .btn {
  font-size: 0.85rem;
  text-decoration: none;
}
</style>
