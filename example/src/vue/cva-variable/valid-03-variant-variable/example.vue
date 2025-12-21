<script setup lang="ts">
import { cva } from 'class-variance-authority';

const validVariant = 'bg-blue-500 hover:bg-blue-700';

// ✅ Valid: Variable with valid classes in variant
// @validClasses [bg-blue-500, hover:bg-blue-700]
</script>

<template>
  <button :class="button({ color: 'primary' })">Valid Variant Variable</button>
</template>
