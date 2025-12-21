<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ⚠️ Warning: Multiple duplicates across base and variants
// @duplicateClasses [flex, flex, items-center, items-center]
</script>

<template>
  <button :class="button({ size: 'sm' })">Multiple duplicates</button>
</template>
