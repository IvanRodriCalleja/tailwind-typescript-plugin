<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ⚠️ Warning: Duplicate with string syntax in variants
// @duplicateClasses [items-center, items-center]
</script>

<template>
  <button :class="button({ size: 'sm' })">Duplicate string variant</button>
</template>
