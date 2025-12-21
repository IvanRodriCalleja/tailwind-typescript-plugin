<script setup lang="ts">
// ✅ Valid: Classes with extra spaces
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <div class="flex  items-center   justify-center">Extra spaces (should be normalized)</div>
</template>
