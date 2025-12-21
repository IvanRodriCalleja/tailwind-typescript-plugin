<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ✅ Valid: No conflict between cva() base and variants
// Variants are designed to override base styles, so this is intentional
</script>

<template>
  <button :class="button({ centered: true })">CVA base+variant no conflict</button>
</template>
