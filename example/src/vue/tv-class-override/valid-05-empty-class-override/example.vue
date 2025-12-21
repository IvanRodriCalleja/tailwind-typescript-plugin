<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ✅ Valid: Empty class property should not error
// @validClasses []
</script>

<template>
  <button :class="button({ color: 'primary', class: '' })">Empty Override</button>
</template>
