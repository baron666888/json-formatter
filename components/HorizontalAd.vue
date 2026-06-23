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
  <div class="horizontal-ad" aria-label="Advertisement">
    <ins
      class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-4389943591020369"
      data-ad-slot="4836588388"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  </div>
</template>

<style scoped>
.horizontal-ad {
  width: min(80vw, 1600px);
  margin: 0 auto;
  padding: 0 2rem;
}

.horizontal-ad :deep(.adsbygoogle) {
  margin: 0 auto;
}

@media (max-width: 900px) {
  .horizontal-ad {
    width: min(92vw, 1600px);
    padding: 0 1rem;
  }
}
</style>
