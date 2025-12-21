<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ✅ Valid: Mix of arrays and strings
// @validClasses [font-semibold, border, bg-blue-500, text-white, text-sm, py-1]
</script>

<template>
  <button :class="button({ intent: 'primary', size: 'small' })">Mixed Valid</button>
</template>
