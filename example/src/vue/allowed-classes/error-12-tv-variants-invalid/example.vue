<script setup lang="ts">
import { tv } from 'tailwind-variants';

// Invalid: tv with invalid class in variants
// @invalidClasses [invalid-tv-variant]
// @validClasses [custom-button, flex, app-header]
const button = tv({
  base: 'custom-button flex',
  variants: {
    variant: {
      primary: 'app-header',
      secondary: 'invalid-tv-variant'
    }
  }
});
</script>

<template>
  <button :class="button({ variant: 'secondary' })">TV Variants Invalid</button>
</template>
