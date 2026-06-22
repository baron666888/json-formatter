<script setup lang="ts">
import { ref } from 'vue'
import { messages, locales, type Locale } from '~/composables/useI18n'

const currentLocale = ref<Locale>('en')

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

provide('currentLocale', currentLocale)
provide('t', t)
provide('setLocale', setLocale)
</script>

<template>
  <div class="layout">
    <header class="nav-header">
      <div class="nav-inner">
        <NuxtLink to="/" class="nav-logo">
          <svg class="nav-logo-icon" viewBox="0 0 48 48" fill="none">
            <defs>
              <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6"/>
                <stop offset="50%" stop-color="#8b5cf6"/>
                <stop offset="100%" stop-color="#10b981"/>
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#navLogoGrad)" opacity="0.15"/>
            <rect x="4" y="4" width="40" height="40" rx="10" stroke="url(#navLogoGrad)" stroke-width="2"/>
            <text x="24" y="32" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="700" fill="url(#navLogoGrad)">{ }</text>
          </svg>
          <span class="nav-logo-text">JSON Formatter</span>
        </NuxtLink>
        <nav class="nav-links" aria-label="Main navigation">
          <NuxtLink to="/" class="nav-link">{{ t('navHome') }}</NuxtLink>
          <div class="nav-dropdown">
            <span class="nav-link nav-dropdown-trigger">{{ t('navArticles') }} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="6 9 12 15 18 9"/></svg></span>
            <div class="nav-dropdown-menu">
              <NuxtLink to="/json-guide" class="nav-dropdown-item">{{ t('navJsonGuide') }}</NuxtLink>
              <NuxtLink to="/json-errors" class="nav-dropdown-item">{{ t('navJsonErrors') }}</NuxtLink>
              <NuxtLink to="/json-vs-xml" class="nav-dropdown-item">{{ t('navJsonVsXml') }}</NuxtLink>
            </div>
          </div>
          <NuxtLink to="/about" class="nav-link">{{ t('navAbout') }}</NuxtLink>
          <NuxtLink to="/privacy" class="nav-link">{{ t('navPrivacy') }}</NuxtLink>
          <NuxtLink to="/terms" class="nav-link">{{ t('navTerms') }}</NuxtLink>
          <NuxtLink to="/contact" class="nav-link">{{ t('navContact') }}</NuxtLink>
        </nav>
        <div class="nav-lang">
          <select :value="currentLocale" @change="setLocale(($event.target as HTMLSelectElement).value as Locale)">
            <option v-for="loc in locales" :key="loc.code" :value="loc.code">
              {{ loc.name }}
            </option>
          </select>
        </div>
      </div>
    </header>

    <main class="layout-main">
      <slot />
    </main>

    <footer class="layout-footer" role="contentinfo">
      <div class="footer-links">
        <NuxtLink to="/privacy">{{ t('navPrivacy') }}</NuxtLink>
        <span class="footer-sep">·</span>
        <NuxtLink to="/terms">{{ t('navTerms') }}</NuxtLink>
        <span class="footer-sep">·</span>
        <NuxtLink to="/about">{{ t('navAbout') }}</NuxtLink>
        <span class="footer-sep">·</span>
        <NuxtLink to="/contact">{{ t('navContact') }}</NuxtLink>
      </div>
      <span>{{ t('copyright').replace('{year}', new Date().getFullYear().toString()) }}</span>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav-header {
  background: #ffffff;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.nav-inner {
  width: min(80vw, 1600px);
  margin: 0 auto;
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  flex-shrink: 0;
}

.nav-logo-icon {
  width: 32px;
  height: 32px;
}

.nav-logo-text {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary), var(--color-success));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.nav-link {
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--color-primary);
  background: rgba(37, 99, 235, 0.08);
}

.nav-link.router-link-active {
  color: var(--color-primary);
  background: rgba(37, 99, 235, 0.1);
  font-weight: 600;
}

.nav-dropdown {
  position: relative;
}

.nav-dropdown-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.nav-dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0.4rem;
  min-width: 180px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 200;
}

.nav-dropdown:hover .nav-dropdown-menu {
  display: block;
}

.nav-dropdown-item {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.nav-dropdown-item:hover {
  color: var(--color-primary);
  background: rgba(37, 99, 235, 0.08);
}

.nav-dropdown-item.router-link-active {
  color: var(--color-primary);
  background: rgba(37, 99, 235, 0.1);
  font-weight: 600;
}

.nav-lang select {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #1e293b;
  padding: 0.35rem 0.6rem;
  font-size: 0.85rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease;
}

.nav-lang select:hover,
.nav-lang select:focus {
  border-color: var(--color-primary);
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.layout-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 2rem;
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  opacity: 0.75;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-links a {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
  font-size: 0.8rem;
}

.footer-links a:hover {
  color: var(--color-primary);
}

.footer-sep {
  opacity: 0.5;
}

@media (max-width: 900px) {
  .nav-inner {
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
  }

  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
    gap: 0.15rem;
  }

  .nav-link {
    padding: 0.3rem 0.5rem;
    font-size: 0.8rem;
  }
}
</style>
