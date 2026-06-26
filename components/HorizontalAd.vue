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
  width: 100%;
}

.horizontal-ad :deep(.adsbygoogle) {
  margin: 0 auto;
}
</style>
