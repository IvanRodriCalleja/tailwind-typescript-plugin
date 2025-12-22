<script setup lang="ts">
import { tv } from 'tailwind-variants';

// Valid: tv with allowed classes in variants
// @validClasses [custom-button, flex, app-header, project-card]
const button = tv({
  base: 'custom-button flex',
  variants: {
    variant: {
      primary: 'app-header',
      secondary: 'project-card'
    }
  }
});
</script>

<template>
  <button :class="button({ variant: 'primary' })">TV Variants Allowed</button>
</template>
