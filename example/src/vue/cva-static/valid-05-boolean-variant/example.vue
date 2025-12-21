<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ✅ Valid: Boolean variants with null for false
// @validClasses [opacity-50, cursor-not-allowed]
</script>

<template>
  <button :class="button({ disabled: true })">Valid Boolean Variant</button>
</template>
