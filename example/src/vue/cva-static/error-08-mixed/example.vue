<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ❌ Invalid: Multiple invalid classes across different sections
// @invalidClasses [invalid-base, invalid-variant, invalid-compound]
// @validClasses [font-semibold, bg-blue-500]
</script>

<template>
  <button :class="button({ intent: 'primary' })">Mixed Invalid</button>
</template>
