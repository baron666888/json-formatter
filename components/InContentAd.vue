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
  <div class="in-content-ad" aria-label="Advertisement">
    <ins
      class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-4389943591020369"
      data-ad-slot="1307919216"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  </div>
</template>

<style scoped>
.in-content-ad {
  margin: 2rem 0;
  padding: 1rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  text-align: center;
}

.in-content-ad :deep(.adsbygoogle) {
  margin: 0 auto;
}
</style>
