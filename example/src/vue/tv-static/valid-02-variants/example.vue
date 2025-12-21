<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ✅ Valid: All variant classes are valid
// @validClasses [bg-blue-500, hover:bg-blue-700, bg-purple-500, hover:bg-purple-700, bg-green-500]
</script>

<template>
  <button :class="button({ color: 'primary' })">Valid Variants</button>
</template>
