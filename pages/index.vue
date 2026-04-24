<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { messages, locales, type Locale } from '~/composables/useI18n'

const currentLocale = ref<Locale>('en')
const inputJson = ref('')
const outputJson = ref('')
const errorInfo = ref<{ message: string; line?: number } | null>(null)
const showToast = ref(false)
const toastMessage = ref('')
let formatTimeout: ReturnType<typeof setTimeout> | null = null
let collapseKeyCounter = 0

const hasInput = computed(() => inputJson.value.trim().length > 0)

function t(key: string, count?: number): string {
  const msg = messages[currentLocale.value]
  const translation = msg[key as keyof typeof msg]
  
  if (Array.isArray(translation)) {
    return count === 1 ? translation[1] : translation[0]
  }
  return translation || key
}

function setLocale(locale: Locale) {
  currentLocale.value = locale
  if (typeof window !== 'undefined') {
    document.documentElement.lang = locale
  }
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

function changeLocale(newLocale: string) {
  setLocale(newLocale as Locale)
}

watch(inputJson, handleInput)

if (typeof window !== 'undefined') {
  ;(window as any).toggleCollapse = function(el: HTMLElement) {
    el.classList.toggle('collapsed')
  }
}
</script>

<template>
  <div class="container">
    <header class="header">
      <div class="logo-wrapper">
        <svg class="logo-icon" viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#3b82f6"/>
              <stop offset="50%" stop-color="#8b5cf6"/>
              <stop offset="100%" stop-color="#10b981"/>
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#logoGrad)" opacity="0.15"/>
          <rect x="4" y="4" width="40" height="40" rx="10" stroke="url(#logoGrad)" stroke-width="2"/>
          <text x="24" y="32" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="700" fill="url(#logoGrad)">{ }</text>
        </svg>
      </div>
      <h1>{{ t('appTitle') }}</h1>
      <p>{{ t('appSubtitle') }}</p>
      <div class="language-switcher">
        <label>{{ t('language') }}:</label>
        <select v-model="currentLocale" @change="changeLocale(currentLocale)">
          <option v-for="loc in locales" :key="loc.code" :value="loc.code">
            {{ loc.name }}
          </option>
        </select>
      </div>
    </header>

    <main class="main-content">
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            {{ t('input') }}
          </div>
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

        <div class="toolbar">
          <button class="btn btn-primary" @click="formatJson" :disabled="!hasInput">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="21" y1="10" x2="3" y2="10"/>
              <line x1="21" y1="6" x2="3" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/>
              <line x1="21" y1="18" x2="3" y2="18"/>
            </svg>
            {{ t('format') }}
          </button>
          <button class="btn btn-secondary" @click="compressJson" :disabled="!hasInput">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="4,14 10,14 10,20"/>
              <polyline points="20,10 14,10 14,4"/>
              <line x1="14" y1="10" x2="21" y2="3"/>
              <line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
            {{ t('compress') }}
          </button>
          <button class="btn btn-success" @click="copyToClipboard" :disabled="!hasInput || errorInfo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            {{ t('copy') }}
          </button>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16,18 22,12 16,6"/>
              <polyline points="8,6 2,12 8,18"/>
            </svg>
            {{ t('output') }}
          </div>
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
      </div>
    </main>

    <div :class="['toast', { show: showToast }]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22,4 12,14.01 9,11.01"/>
      </svg>
      {{ t(toastMessage) }}
    </div>
  </div>
</template>

<style>
.language-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.language-switcher label {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.language-switcher select {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  color: var(--color-text);
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease;
}

.language-switcher select:hover,
.language-switcher select:focus {
  border-color: var(--color-primary);
}

.json-collapsible {
  position: relative;
  cursor: pointer;
  user-select: none;
  border-radius: 3px;
  padding: 1px 3px;
  margin-left: -4px;
  transition: background 0.15s ease;
}

.json-collapsible:hover {
  background: rgba(59, 130, 246, 0.12);
}

.json-collapsible .toggle-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-right: 2px;
  border-radius: 2px;
  color: #64748b;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  vertical-align: middle;
}

.json-collapsible .toggle-icon svg {
  width: 12px;
  height: 12px;
}

.json-collapsible:hover .toggle-icon {
  color: #60a5fa;
}

.json-collapsible.collapsed .toggle-icon {
  transform: rotate(-90deg);
}

.json-collapsible.collapsed:hover .toggle-icon {
  transform: rotate(0deg) scale(1.1) !important;
}

.json-collapsible .json-collapsed-content {
  display: none;
  color: #94a3b8;
  font-style: italic;
  font-size: 0.9em;
}

.json-collapsible.collapsed .json-collapsed-content {
  display: inline;
  margin-left: 2px;
}

.json-collapsible.collapsed + .json-content {
  display: none;
}

.json-content {
  display: inline;
}

.nested-json-wrapper {
  display: block;
  margin-left: 24px;
  border-left: 2px solid rgba(59, 130, 246, 0.3);
  padding-left: 8px;
  margin-top: 4px;
}

.json-collapsible.nested {
  margin-left: 0;
}

.json-collapsible.nested .nested-label {
  color: #818cf8;
  font-size: 0.85em;
}

.json-content.nested {
  display: block;
}

.json-comma {
  color: var(--color-text-secondary);
}
</style>
