<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ✅ Valid: Array syntax in variants
// @validClasses [bg-blue-500, hover:bg-blue-700, text-white, text-xs, px-2, py-1]
</script>

<template>
  <button :class="button({ color: 'primary', size: 'sm' })">Valid Array Variants</button>
</template>
