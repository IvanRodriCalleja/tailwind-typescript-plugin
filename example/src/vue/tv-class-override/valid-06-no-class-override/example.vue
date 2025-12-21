<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ✅ Valid: No class override, only variant
// @validClasses []
</script>

<template>
  <button :class="button({ color: 'primary' })">No Override</button>
</template>
