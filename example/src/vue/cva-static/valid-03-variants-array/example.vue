<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ✅ Valid: All variant classes are valid (arrays)
// @validClasses [bg-blue-500, text-white, border-transparent, bg-white, text-gray-800]
</script>

<template>
  <button :class="button({ intent: 'primary' })">Valid Variants</button>
</template>
