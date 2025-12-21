<script setup lang="ts">
// ✅ Valid: Binary expression that evaluates to empty string
// @validClasses [flex, items-center]
</script>

<template>
  <div :class="`flex ${false && 'text-red-500'} items-center`">Binary with false</div>
</template>
