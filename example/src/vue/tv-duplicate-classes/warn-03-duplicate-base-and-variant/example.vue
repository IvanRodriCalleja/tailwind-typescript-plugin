<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ⚠️ Warning: Class in base repeated in variant
// @duplicateClasses [flex, flex]
</script>

<template>
  <button :class="button({ size: 'sm' })">Duplicate base + variant</button>
</template>
