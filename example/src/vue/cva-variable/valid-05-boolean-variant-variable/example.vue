<script setup lang="ts">
import { cva } from 'class-variance-authority';

const validBase = 'flex items-center';

// ✅ Valid: Boolean variant with variable for true
// @validClasses [flex, items-center]
</script>

<template>
  <button :class="button({ active: true })">Valid Boolean Variable</button>
</template>
