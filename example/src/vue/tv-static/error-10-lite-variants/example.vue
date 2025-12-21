<script setup lang="ts">
import { tv as tvLite } from 'tailwind-variants/lite';

// ❌ Invalid: Lite version with invalid variant class
// @invalidClasses [invalid-lite-variant]
// @validClasses [bg-red-500]
</script>

<template>
  <button :class="button({ color: 'danger' })">Invalid Lite Variants</button>
</template>
