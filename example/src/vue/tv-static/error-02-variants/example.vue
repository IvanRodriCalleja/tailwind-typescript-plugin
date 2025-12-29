<script setup lang="ts">
import { tv } from 'tailwind-variants';

const button = tv({
  base: 'font-semibold',
  variants: {
    color: {
      primary: 'bg-blue-500 invalid-variant-class'
    }
  }
});

// ❌ Invalid: Contains invalid class in variant
// @invalidClasses [invalid-variant-class]
// @validClasses [bg-blue-500]
</script>

<template>
  <button :class="button({ color: 'primary' })">Invalid Variant</button>
</template>
