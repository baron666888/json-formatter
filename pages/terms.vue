<script setup lang="ts">
import { ref } from 'vue'
import { type Locale } from '~/composables/useI18n'

const currentLocale = inject<Ref<Locale>>('currentLocale', ref('en'))
const tFn = inject<(key: string) => string>('t', (k: string) => k)
const t = (key: string) => tFn(key)

usePageMeta({
  titleKey: 'termsTitle',
  descKey: 'metaDescTerms',
  t,
  currentLocale,
  path: '/terms'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': t('navHome'), 'item': 'https://json.znow-ai.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': t('navTerms'), 'item': 'https://json.znow-ai.com/terms' }
        ]
      })
    }
  ]
})
</script>

<template>
  <div class="content-page">
    <div class="content-container">
      <h1 class="page-title">{{ t('termsTitle') }}</h1>
      <p class="page-updated">{{ t('termsLastUpdated') }}</p>
      <p class="page-intro">{{ t('termsIntro') }}</p>

      <section class="content-section">
        <h2>{{ t('termsSection1Title') }}</h2>
        <p>{{ t('termsSection1Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('termsSection2Title') }}</h2>
        <p>{{ t('termsSection2Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('termsSection3Title') }}</h2>
        <p>{{ t('termsSection3Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('termsSection4Title') }}</h2>
        <p>{{ t('termsSection4Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('termsSection5Title') }}</h2>
        <p>{{ t('termsSection5Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('termsSection6Title') }}</h2>
        <p>{{ t('termsSection6Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('termsSection7Title') }}</h2>
        <p>{{ t('termsSection7Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('termsSection8Title') }}</h2>
        <p>{{ t('termsSection8Text') }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
@import '~/assets/css/content-page.css';
</style>
