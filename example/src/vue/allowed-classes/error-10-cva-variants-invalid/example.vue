<script setup lang="ts">
import { cva } from 'class-variance-authority';

// Invalid: cva with invalid class in variants
// @invalidClasses [invalid-variant-class]
// @validClasses [custom-button, flex, app-header]
const button = cva(['custom-button', 'flex'], {
  variants: {
    variant: {
      primary: ['app-header'],
      secondary: ['invalid-variant-class']
    }
  }
});
</script>

<template>
  <button :class="button({ variant: 'secondary' })">CVA Variants Invalid</button>
</template>
