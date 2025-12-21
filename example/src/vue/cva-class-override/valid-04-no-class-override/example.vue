<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ✅ Valid: No class override, only variants
// @validClasses []
</script>

<template>
  <button :class="button({ intent: 'primary' })">No Override</button>
</template>
