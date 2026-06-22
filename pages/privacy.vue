<script setup lang="ts">
import { ref } from 'vue'
import { type Locale } from '~/composables/useI18n'

const currentLocale = inject<Ref<Locale>>('currentLocale', ref('en'))
const tFn = inject<(key: string) => string>('t', (k: string) => k)
const t = (key: string) => tFn(key)

useHead({
  title: () => `${t('privacyTitle')} - JSON Formatter`
})
</script>

<template>
  <div class="content-page">
    <div class="content-container">
      <h1 class="page-title">{{ t('privacyTitle') }}</h1>
      <p class="page-updated">{{ t('privacyLastUpdated') }}</p>
      <p class="page-intro">{{ t('privacyIntro') }}</p>

      <section class="content-section">
        <h2>{{ t('privacySection1Title') }}</h2>
        <p>{{ t('privacySection1Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('privacySection2Title') }}</h2>
        <p>{{ t('privacySection2Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('privacySection3Title') }}</h2>
        <p>{{ t('privacySection3Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('privacySection4Title') }}</h2>
        <p>{{ t('privacySection4Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('privacySection5Title') }}</h2>
        <p>{{ t('privacySection5Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('privacySection6Title') }}</h2>
        <p>{{ t('privacySection6Text') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('privacySection7Title') }}</h2>
        <p>{{ t('privacySection7Text') }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
@import '~/assets/css/content-page.css';
</style>
