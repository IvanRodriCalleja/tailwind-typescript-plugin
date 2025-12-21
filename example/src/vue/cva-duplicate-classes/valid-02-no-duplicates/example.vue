<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ✅ Valid: All unique classes
// @validClasses [flex, items-center, justify-between, text-sm, px-2, py-1, text-lg, px-4, py-2]
</script>

<template>
  <button :class="button({ size: 'sm' })">No duplicates</button>
</template>
