<script setup lang="ts">
import { ref } from 'vue'
import { type Locale } from '~/composables/useI18n'

const currentLocale = inject<Ref<Locale>>('currentLocale', ref('en'))
const tFn = inject<(key: string) => string>('t', (k: string) => k)
const t = (key: string) => tFn(key)

useHead({
  title: () => `${t('aboutTitle')} - JSON Formatter`
})
</script>

<template>
  <div class="content-page">
    <div class="content-container">
      <h1 class="page-title">{{ t('aboutTitle') }}</h1>
      <p class="page-intro">{{ t('aboutIntro') }}</p>

      <section class="content-section">
        <h2>{{ t('aboutMissionTitle') }}</h2>
        <p>{{ t('aboutMissionText') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('aboutFeaturesTitle') }}</h2>
        <ul class="feature-list">
          <li>{{ t('aboutFeature1') }}</li>
          <li>{{ t('aboutFeature2') }}</li>
          <li>{{ t('aboutFeature3') }}</li>
          <li>{{ t('aboutFeature4') }}</li>
          <li>{{ t('aboutFeature5') }}</li>
          <li>{{ t('aboutFeature6') }}</li>
          <li>{{ t('aboutFeature7') }}</li>
        </ul>
      </section>

      <section class="content-section">
        <h2>{{ t('aboutTechTitle') }}</h2>
        <p>{{ t('aboutTechText') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('aboutWhyTitle') }}</h2>
        <ul class="feature-list">
          <li>{{ t('aboutWhy1') }}</li>
          <li>{{ t('aboutWhy2') }}</li>
          <li>{{ t('aboutWhy3') }}</li>
          <li>{{ t('aboutWhy4') }}</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
@import '~/assets/css/content-page.css';
</style>
