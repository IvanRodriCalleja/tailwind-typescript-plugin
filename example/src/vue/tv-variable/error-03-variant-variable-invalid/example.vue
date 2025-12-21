<script setup lang="ts">
import { tv } from 'tailwind-variants';

const invalidVariant = 'invalid-tv-variant-var';

// ❌ Invalid: Variable with invalid class in variant
// @invalidClasses [invalid-tv-variant-var]
</script>

<template>
  <button :class="button({ color: 'primary' })">Invalid Variant Variable</button>
</template>
