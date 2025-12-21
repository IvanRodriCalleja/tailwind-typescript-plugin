<script setup lang="ts">
import { cva } from 'class-variance-authority';

// Valid: cva with allowed classes in variants
// @validClasses [custom-button, flex, app-header, project-card]
const button = cva(['custom-button', 'flex'], {
  variants: {
    variant: {
      primary: ['app-header'],
      secondary: ['project-card']
    }
  }
});
</script>

<template>
  <button :class="button({ variant: 'primary' })">CVA Variants Allowed</button>
</template>
