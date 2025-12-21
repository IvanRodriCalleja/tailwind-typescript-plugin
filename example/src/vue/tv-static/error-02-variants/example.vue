<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ❌ Invalid: Contains invalid class in variant
// @invalidClasses [invalid-variant-class]
// @validClasses [bg-blue-500]
</script>

<template>
  <button :class="button({ color: 'primary' })">Invalid Variant</button>
</template>
