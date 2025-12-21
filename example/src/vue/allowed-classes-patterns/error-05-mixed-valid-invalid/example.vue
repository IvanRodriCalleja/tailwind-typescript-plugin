<script setup lang="ts">
// ❌ Invalid: Mix of valid patterns and invalid class
// @invalidClasses [not-allowed]
// @validClasses [custom-header, close-icon]
</script>

<template>
  <div class="custom-header close-icon not-allowed">Mixed</div>
</template>
