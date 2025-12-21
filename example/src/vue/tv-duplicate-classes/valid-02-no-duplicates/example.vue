<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ✅ Valid: All unique classes
</script>

<template>
  <button :class="button({ size: 'sm' })">No duplicates</button>
</template>
