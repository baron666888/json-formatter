<script setup lang="ts">
import { type Locale } from '~/composables/useI18n'

const currentLocale = inject<Ref<Locale>>('currentLocale', ref('en'))

useHead({
  htmlAttrs: {
    lang: () => currentLocale.value
  },
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ]
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
