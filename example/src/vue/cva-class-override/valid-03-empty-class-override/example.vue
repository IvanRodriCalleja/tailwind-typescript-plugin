<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ✅ Valid: Empty class property should not error
// @validClasses []
</script>

<template>
  <button :class="button({ intent: 'primary', class: '' })">Empty Override</button>
</template>
