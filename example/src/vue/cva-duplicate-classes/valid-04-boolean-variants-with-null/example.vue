<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ✅ Valid: Boolean variants with null
// @validClasses [flex, opacity-50, cursor-not-allowed]
</script>

<template>
  <button :class="button({ disabled: true })">Boolean variant</button>
</template>
