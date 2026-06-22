<script setup lang="ts">
import { ref } from 'vue'
import { type Locale } from '~/composables/useI18n'
import emailjs from '@emailjs/browser'

const currentLocale = inject<Ref<Locale>>('currentLocale', ref('en'))
const tFn = inject<(key: string) => string>('t', (k: string) => k)
const t = (key: string) => tFn(key)

usePageMeta({
  titleKey: 'contactTitle',
  descKey: 'metaDescContact',
  t,
  currentLocale,
  path: '/contact'
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
          { '@type': 'ListItem', 'position': 2, 'name': t('navContact'), 'item': 'https://json.znow-ai.com/contact' }
        ]
      })
    }
  ]
})

const form = ref<HTMLFormElement | null>(null)
const sending = ref(false)
const sent = ref(false)
const error = ref(false)

async function sendEmail() {
  if (!form.value) return

  sending.value = true
  sent.value = false
  error.value = false

  try {
    await emailjs.sendForm(
      'service_l8pt134',
      'template_tpjkr4i',
      form.value,
      { publicKey: '1Vhp_t59P91Vzm6r2' }
    )
    sent.value = true
    form.value.reset()
  } catch (e) {
    error.value = true
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="content-page">
    <div class="content-container">
      <h1 class="page-title">{{ t('contactTitle') }}</h1>
      <p class="page-intro">{{ t('contactIntro') }}</p>

      <section class="content-section">
        <h2>{{ t('contactFormTitle') }}</h2>
        <form ref="form" class="contact-form" @submit.prevent="sendEmail">
          <div class="form-row">
            <div class="form-group">
              <label for="name">{{ t('contactFormName') }}</label>
              <input
                id="name"
                type="text"
                name="from_name"
                :placeholder="t('contactFormNamePlaceholder')"
                required
              />
            </div>
            <div class="form-group">
              <label for="email">{{ t('contactFormEmail') }}</label>
              <input
                id="email"
                type="email"
                name="from_email"
                :placeholder="t('contactFormEmailPlaceholder')"
                required
              />
            </div>
          </div>
          <div class="form-group">
            <label for="subject">{{ t('contactFormSubject') }}</label>
            <input
              id="subject"
              type="text"
              name="subject"
              :placeholder="t('contactFormSubjectPlaceholder')"
              required
            />
          </div>
          <div class="form-group">
            <label for="message">{{ t('contactFormMessage') }}</label>
            <textarea
              id="message"
              name="message"
              rows="6"
              :placeholder="t('contactFormMessagePlaceholder')"
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary" :disabled="sending">
            <svg v-if="sending" class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            {{ sending ? t('contactFormSending') : t('contactFormSubmit') }}
          </button>
          <div v-if="sent" class="form-message success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
            {{ t('contactFormSuccess') }}
          </div>
          <div v-if="error" class="form-message error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ t('contactFormError') }}
          </div>
        </form>
      </section>

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

.contact-form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.form-group input,
.form-group textarea {
  background: #ffffff;
  border: 1px solid #d6e0ef;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: #0f172a;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #94a3b8;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.contact-form .btn {
  align-self: flex-start;
  padding: 0.65rem 1.5rem;
  font-size: 0.9rem;
  gap: 0.5rem;
}

.contact-form .btn svg {
  width: 18px;
  height: 18px;
}

.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.form-message {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-message svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.form-message.success {
  color: #047857;
  background: rgba(5, 150, 105, 0.1);
  border: 1px solid rgba(5, 150, 105, 0.25);
}

.form-message.error {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.25);
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
