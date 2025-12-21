<script setup lang="ts">
import { cva } from 'class-variance-authority';

const invalidVariant = 'invalid-cva-variant-var';

// ❌ Invalid: Array variant with invalid variable element
// @invalidClasses [invalid-cva-variant-var]
// @validClasses [text-sm]
</script>

<template>
  <button :class="button({ color: 'primary' })">Invalid Array Variant Variable</button>
</template>
