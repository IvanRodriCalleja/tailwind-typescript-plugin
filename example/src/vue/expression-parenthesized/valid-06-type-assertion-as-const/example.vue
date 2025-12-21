<script setup lang="ts">
// ✅ Valid: Type assertion with 'as const'
// @validClasses [bg-blue-500]
</script>

<template>
  <div :class="'bg-blue-500' as const">Type assertion as const</div>
</template>
