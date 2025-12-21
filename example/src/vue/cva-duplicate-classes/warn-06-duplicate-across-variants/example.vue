<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ⚠️ Warning: Duplicates across multiple variants
// @duplicateClasses [flex, flex]
</script>

<template>
  <button :class="button({ intent: 'primary', size: 'lg' })">Cross-variant duplicate</button>
</template>
