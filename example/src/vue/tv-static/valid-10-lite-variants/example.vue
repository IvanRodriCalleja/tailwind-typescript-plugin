<script setup lang="ts">
import { tv as tvLite } from 'tailwind-variants/lite';

// ✅ Valid: Lite version with valid variants
// @validClasses [bg-red-500, hover:bg-red-700, bg-yellow-500, hover:bg-yellow-700]
</script>

<template>
  <button :class="button({ color: 'danger' })">Valid Lite Variants</button>
</template>
