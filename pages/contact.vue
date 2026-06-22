<script setup lang="ts">
import { ref } from 'vue'
import { type Locale } from '~/composables/useI18n'

const currentLocale = inject<Ref<Locale>>('currentLocale', ref('en'))
const tFn = inject<(key: string) => string>('t', (k: string) => k)
const t = (key: string) => tFn(key)

useHead({
  title: () => `${t('contactTitle')} - JSON Formatter`
})
</script>

<template>
  <div class="content-page">
    <div class="content-container">
      <h1 class="page-title">{{ t('contactTitle') }}</h1>
      <p class="page-intro">{{ t('contactIntro') }}</p>

      <section class="content-section">
        <h2>{{ t('contactEmailTitle') }}</h2>
        <p>{{ t('contactEmailText') }}</p>
        <p class="email-link">
          <a :href="`mailto:${t('contactEmail')}`">{{ t('contactEmail') }}</a>
        </p>
      </section>

      <section class="content-section">
        <h2>{{ t('contactFeedbackTitle') }}</h2>
        <p>{{ t('contactFeedbackText') }}</p>
      </section>

      <section class="content-section">
        <h2>{{ t('contactResponseTitle') }}</h2>
        <p>{{ t('contactResponseText') }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
@import '~/assets/css/content-page.css';

.email-link {
  margin-top: 0.75rem;
}

.email-link a {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.email-link a:hover {
  border-bottom-color: var(--color-primary);
}
</style>
