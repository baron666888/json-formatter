<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { messages, type Locale } from '~/composables/useI18n'

const currentLocale = inject<Ref<Locale>>('currentLocale', ref('en'))
const tFn = inject<(key: string, count?: number) => string>('t', (k: string) => k)

usePageMeta({
  titleKey: 'appTitle',
  descKey: 'metaDescHome',
  t: tFn as (key: string) => string,
  currentLocale,
  path: '/'
})

// Override titleTemplate for homepage to avoid "JSON Formatter - JSON Formatter"
useHead({
  titleTemplate: '%s'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'JSON Formatter',
        'alternateName': ['JSON Validator', 'JSON Beautifier'],
        'description': tFn('metaDescHome'),
        'url': 'https://json.znow-ai.com/',
        'applicationCategory': 'DeveloperApplication',
        'operatingSystem': 'Any',
        'browserRequirements': 'Requires modern web browser',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
          'availability': 'https://schema.org/InStock'
        },
        'featureList': [
          'JSON syntax highlighting',
          'JSON formatting and beautification',
          'JSON compression',
          'JSON validation with error location',
          'Nested JSON collapse/expand',
          'One-click copy'
        ]
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': tFn('navHome'), 'item': 'https://json.znow-ai.com/' }
        ]
      })
    }
  ]
})

const inputJson = ref('')
const outputJson = ref('')
const errorInfo = ref<{ message: string; line?: number } | null>(null)
const showToast = ref(false)
const toastMessage = ref('')
let formatTimeout: ReturnType<typeof setTimeout> | null = null
let collapseKeyCounter = 0

const hasInput = computed(() => inputJson.value.trim().length > 0)

function t(key: string, count?: number): string {
  return tFn(key, count)
}

function isValidJson(str: string): boolean {
  try {
    const parsed = JSON.parse(str)
    return typeof parsed === 'object' && parsed !== null
  } catch {
    return false
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function syntaxHighlightValue(value: any, depth: number = 0): string {
  if (value === null) {
    return '<span class="json-null">null</span>'
  }

  if (typeof value === 'boolean') {
    return `<span class="json-boolean">${value}</span>`
  }

  if (typeof value === 'number') {
    return `<span class="json-number">${value}</span>`
  }

  if (typeof value === 'string') {
    const escaped = escapeHtml(value)

    if (isValidJson(value)) {
      const parsed = JSON.parse(value)
      const formatted = JSON.stringify(parsed, null, 2)
      const key = `collapse-${collapseKeyCounter++}`
      const childCount = countObjectKeys(parsed)
      const label = childCount > 0 ? `${childCount} ${t('keys', childCount)}` : t('empty')

      let result = `<span class="json-string">"${escaped.slice(0, 20)}${escaped.length > 20 ? '...' : ''}"</span>`
      result += `<span class="nested-json-wrapper">`
      result += `<span class="json-collapsible nested" data-key="${key}" onclick="toggleCollapse(this)">`
      result += `<span class="toggle-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>`
      result += `<span class="nested-label">[${t('nestedJson')}: ${label}]</span>`
      result += `</span>`
      result += `<span class="json-content nested" data-end="${key}">`
      result += `\n${'  '.repeat(depth + 1)}<span class="nested-content">`
      result += syntaxHighlightValue(parsed, depth + 1).trim()
      result += `</span>\n${'  '.repeat(depth)}</span>`
      result += `</span>`
      return result
    }

    return `<span class="json-string">"${escaped}"</span>`
  }

  if (Array.isArray(value)) {
    return syntaxHighlightArray(value, depth)
  }

  if (typeof value === 'object') {
    return syntaxHighlightObject(value, depth)
  }

  return String(value)
}

function countObjectKeys(obj: any): number {
  if (typeof obj !== 'object' || obj === null) return 0
  if (Array.isArray(obj)) return obj.length
  return Object.keys(obj).length
}

function syntaxHighlightArray(arr: any[], depth: number): string {
  if (arr.length === 0) {
    return '<span class="json-bracket">[]</span>'
  }

  const key = `collapse-${collapseKeyCounter++}`
  const label = `${arr.length} ${t('items', arr.length)}`

  let result = `<span class="json-collapsible" data-key="${key}" onclick="toggleCollapse(this)">`
  result += `<span class="toggle-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>`
  result += `<span class="json-bracket">[</span>`
  result += `<span class="json-collapsed-content"> ${label} </span>`
  result += `</span>`
  result += `<span class="json-content" data-end="${key}">`

  arr.forEach((item, index) => {
    result += `\n${'  '.repeat(depth + 1)}`
    result += syntaxHighlightValue(item, depth + 1)
    if (index < arr.length - 1) {
      result += `<span class="json-comma">,</span>`
    }
  })

  result += `\n${'  '.repeat(depth)}</span>`
  result += `<span class="json-bracket">]</span>`

  return result
}

function syntaxHighlightObject(obj: Record<string, any>, depth: number): string {
  const keys = Object.keys(obj)

  if (keys.length === 0) {
    return '<span class="json-bracket">{}</span>'
  }

  const key = `collapse-${collapseKeyCounter++}`
  const label = `${keys.length} ${t('keys', keys.length)}`

  let result = `<span class="json-collapsible" data-key="${key}" onclick="toggleCollapse(this)">`
  result += `<span class="toggle-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>`
  result += `<span class="json-bracket">{</span>`
  result += `<span class="json-collapsed-content"> ${label} </span>`
  result += `</span>`
  result += `<span class="json-content" data-end="${key}">`

  keys.forEach((k, index) => {
    result += `\n${'  '.repeat(depth + 1)}`
    result += `<span class="json-key">"${escapeHtml(k)}"</span>`
    result += `<span class="json-bracket">:</span> `
    result += syntaxHighlightValue(obj[k], depth + 1)
    if (index < keys.length - 1) {
      result += `<span class="json-comma">,</span>`
    }
  })

  result += `\n${'  '.repeat(depth)}</span>`
  result += `<span class="json-bracket">}</span>`

  return result
}

function validateAndFormat() {
  const input = inputJson.value.trim()
  collapseKeyCounter = 0

  if (!input) {
    outputJson.value = ''
    errorInfo.value = null
    return
  }

  try {
    const parsed = JSON.parse(input)
    outputJson.value = syntaxHighlightValue(parsed, 0)
    errorInfo.value = null
  } catch (e: any) {
    outputJson.value = ''
    const msg = e.message || 'Invalid JSON'
    const lineMatch = msg.match(/position\s+(\d+)/i)
    let line: number | undefined

    if (lineMatch) {
      const pos = parseInt(lineMatch[1])
      const lines = input.substring(0, pos).split('\n')
      line = lines.length
    }

    errorInfo.value = { message: msg, line }
  }
}

function handleInput() {
  if (formatTimeout) clearTimeout(formatTimeout)
  formatTimeout = setTimeout(validateAndFormat, 300)
}

function formatJson() {
  if (formatTimeout) clearTimeout(formatTimeout)
  validateAndFormat()
}

function compressJson() {
  const input = inputJson.value.trim()
  if (!input) return

  try {
    const parsed = JSON.parse(input)
    inputJson.value = JSON.stringify(parsed)
    validateAndFormat()
  } catch (e: any) {
    errorInfo.value = { message: e.message }
  }
}

function clearAll() {
  inputJson.value = ''
  outputJson.value = ''
  errorInfo.value = null
}

async function copyToClipboard() {
  const input = inputJson.value.trim()
  if (!input) return

  try {
    const parsed = JSON.parse(input)
    const formatted = JSON.stringify(parsed, null, 2)
    await navigator.clipboard.writeText(formatted)
    showToastMessage('copied')
  } catch (e: any) {
    errorInfo.value = { message: e.message }
  }
}

function showToastMessage(key: string) {
  toastMessage.value = key
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

function expandAll() {
  const collapsibles = document.querySelectorAll('.json-collapsible.collapsed')
  collapsibles.forEach(el => el.classList.remove('collapsed'))
}

function collapseAll() {
  const collapsibles = document.querySelectorAll('.json-collapsible:not(.collapsed)')
  collapsibles.forEach(el => el.classList.add('collapsed'))
}

watch(inputJson, handleInput)

if (typeof window !== 'undefined') {
  ;(window as any).toggleCollapse = function(el: HTMLElement) {
    el.classList.toggle('collapsed')
  }
}
</script>

<template>
  <div class="index-page">
    <header class="header" role="banner">
      <h1>{{ t('appTitle') }}</h1>
      <p>{{ t('appSubtitle') }}</p>
    </header>

    <HorizontalAd />

    <div class="main-content" role="main">
      <section class="panel" aria-labelledby="input-panel-title">
        <div class="panel-header">
          <h2 id="input-panel-title" class="panel-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            {{ t('input') }}
          </h2>
          <div class="panel-actions">
            <button class="btn btn-secondary" @click="clearAll" :title="t('clear')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>

        <textarea
          v-model="inputJson"
          :class="{ error: errorInfo }"
          :placeholder="t('placeholder')"
          spellcheck="false"
        ></textarea>

        <div v-if="errorInfo" class="error-message fade-in">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <span v-if="errorInfo.line" class="error-line">{{ t('line') }} {{ errorInfo.line }}: </span>
            {{ errorInfo.message }}
          </div>
        </div>

        <div class="toolbar" role="toolbar" aria-label="JSON formatting tools">
          <button class="btn btn-primary" @click="formatJson" :disabled="!hasInput">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <line x1="21" y1="10" x2="3" y2="10"/>
              <line x1="21" y1="6" x2="3" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/>
              <line x1="21" y1="18" x2="3" y2="18"/>
            </svg>
            {{ t('format') }}
          </button>
          <button class="btn btn-secondary" @click="compressJson" :disabled="!hasInput">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="4,14 10,14 10,20"/>
              <polyline points="20,10 14,10 14,4"/>
              <line x1="14" y1="10" x2="21" y2="3"/>
              <line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
            {{ t('compress') }}
          </button>
          <button class="btn btn-success" @click="copyToClipboard" :disabled="!hasInput || errorInfo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            {{ t('copy') }}
          </button>
        </div>
      </section>

      <section class="panel" aria-labelledby="output-panel-title">
        <div class="panel-header">
          <h2 id="output-panel-title" class="panel-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="16,18 22,12 16,6"/>
              <polyline points="8,6 2,12 8,18"/>
            </svg>
            {{ t('output') }}
          </h2>
          <div class="panel-actions">
            <button class="btn btn-secondary" @click="collapseAll" :title="t('collapseAll')" :disabled="!outputJson">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="4,14 10,14 10,20"/>
                <polyline points="20,10 14,10 14,4"/>
                <line x1="14" y1="10" x2="21" y2="3"/>
                <line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </button>
            <button class="btn btn-secondary" @click="expandAll" :title="t('expandAll')" :disabled="!outputJson">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,3 21,3 21,9"/>
                <polyline points="9,21 3,21 3,15"/>
                <line x1="21" y1="3" x2="14" y2="10"/>
                <line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="output-area">
          <pre v-if="outputJson" v-html="outputJson" class="fade-in"></pre>
          <div v-else class="output-placeholder">
            {{ t('emptyOutput') }}
          </div>
        </div>
      </section>
    </div>

    <InContentAd />

    <div :class="['toast', { show: showToast }]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22,4 12,14.01 9,11.01"/>
      </svg>
      {{ t(toastMessage) }}
    </div>
  </div>
</template>

<style scoped>
.index-page {
  width: min(80vw, 1600px);
  margin: 0 auto;
  padding: 1.5rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.header {
  text-align: center;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.header h1 {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary) 0%, #60a5fa 50%, var(--color-success) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.header p {
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

@media (max-width: 900px) {
  .index-page {
    width: min(92vw, 1600px);
    padding: 1.25rem 1rem 2rem;
  }

  .main-content {
    grid-template-columns: 1fr;
  }
}

.panel {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.07);
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.panel-title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-title svg {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
}

.panel-actions {
  display: flex;
  gap: 0.5rem;
}

textarea {
  flex: 1;
  width: 100%;
  min-height: 0;
  background: #ffffff;
  border: 1px solid #d6e0ef;
  border-radius: 12px;
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: #0f172a;
  resize: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  overflow-y: auto;
}

textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

textarea.error {
  border-color: var(--color-error);
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
}

textarea::placeholder {
  color: #94a3b8;
  opacity: 0.8;
}

.output-area {
  flex: 1;
  min-height: 0;
  background: #ffffff;
  border: 1px solid #d6e0ef;
  border-radius: 12px;
  padding: 1rem;
  overflow: auto;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.7;
}

.output-area pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.output-placeholder {
  color: #94a3b8;
  opacity: 0.8;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.error-message {
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.error-message svg {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-top: 2px;
}

.error-line {
  font-weight: 500;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn svg {
  width: 16px;
  height: 16px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, #2563eb 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
}

.btn-secondary:hover {
  background: #f8fafc;
  color: #0f172a;
}

.btn-success {
  background: linear-gradient(135deg, var(--color-success) 0%, #059669 100%);
  color: white;
}

.btn-success:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: #ecfdf5;
  border: 1px solid #86efac;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #047857;
  font-weight: 500;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1000;
}

.toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.toast svg {
  width: 20px;
  height: 20px;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.toolbar .btn {
  flex: 1;
  min-width: 120px;
  justify-content: center;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease;
}

/* JSON syntax highlighting */
:deep(.json-key) { color: #1e6f5c; font-weight: 600; }
:deep(.json-string) { color: #047857; }
:deep(.json-number) { color: #b45309; }
:deep(.json-boolean) { color: #be185d; }
:deep(.json-null) { color: #7c3aed; }
:deep(.json-bracket) { color: #64748b; }

:deep(.json-collapsible) {
  position: relative;
  cursor: pointer;
  user-select: none;
  border-radius: 3px;
  padding: 1px 3px;
  margin-left: -4px;
  transition: background 0.15s ease;
}

:deep(.json-collapsible:hover) {
  background: rgba(59, 130, 246, 0.12);
}

:deep(.json-collapsible .toggle-icon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-right: 2px;
  border-radius: 2px;
  color: #475569;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  vertical-align: middle;
}

:deep(.json-collapsible .toggle-icon svg) {
  width: 12px;
  height: 12px;
}

:deep(.json-collapsible:hover .toggle-icon) {
  color: #2563eb;
}

:deep(.json-collapsible.collapsed .toggle-icon) {
  transform: rotate(-90deg);
}

:deep(.json-collapsible.collapsed:hover .toggle-icon) {
  transform: rotate(0deg) scale(1.1) !important;
}

:deep(.json-collapsible .json-collapsed-content) {
  display: none;
  color: #64748b;
  font-style: italic;
  font-size: 0.9em;
}

:deep(.json-collapsible.collapsed .json-collapsed-content) {
  display: inline;
  margin-left: 2px;
}

:deep(.json-collapsible.collapsed + .json-content) {
  display: none;
}

:deep(.json-content) {
  display: inline;
}

:deep(.nested-json-wrapper) {
  display: block;
  margin-left: 24px;
  border-left: 2px solid rgba(37, 99, 235, 0.25);
  padding-left: 8px;
  margin-top: 4px;
}

:deep(.json-collapsible.nested) {
  margin-left: 0;
}

:deep(.json-collapsible.nested .nested-label) {
  color: #4f46e5;
  font-size: 0.85em;
}

:deep(.json-content.nested) {
  display: block;
}

:deep(.json-comma) {
  color: var(--color-text-secondary);
}
</style>
