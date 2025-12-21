<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ✅ Valid: No conflict between tv() base and variants
// Variants are designed to override base styles, so this is intentional
</script>

<template>
  <button :class="button({ align: 'center' })">TV base+variant no conflict</button>
</template>
