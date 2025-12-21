<script setup lang="ts">
import { tv } from 'tailwind-variants';

const invalidVariant = 'invalid-tv-variant-var';

// ❌ Invalid: Array variant with invalid variable element
// @invalidClasses [invalid-tv-variant-var]
// @validClasses [text-sm]
</script>

<template>
  <button :class="button({ color: 'primary' })">Invalid Array Variant Variable</button>
</template>
