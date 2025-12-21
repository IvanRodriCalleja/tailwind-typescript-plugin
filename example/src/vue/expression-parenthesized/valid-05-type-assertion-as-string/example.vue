<script setup lang="ts">
// ✅ Valid: Type assertion with 'as string'
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="'flex items-center' as string">Type assertion as string</div>
</template>
