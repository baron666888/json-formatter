<script setup lang="ts">
onMounted(() => {
  try {
    ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
    ;(window as any).adsbygoogle.push({})
  } catch (e) {
    // AdSense may not be loaded yet
  }
})
</script>

<template>
  <aside class="content-sidebar" aria-label="Advertisement">
    <div class="sidebar-ad">
      <ins
        class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-4389943591020369"
        data-ad-slot="2760683835"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  </aside>
</template>

<style scoped>
.content-sidebar {
  flex-shrink: 0;
  width: 180px;
  position: sticky;
  top: 80px;
  align-self: flex-start;
}

.sidebar-ad {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.75rem;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  min-height: 300px;
}

@media (max-width: 1100px) {
  .content-sidebar {
    display: none;
  }
}
</style>
