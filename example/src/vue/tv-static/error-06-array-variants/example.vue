<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ❌ Invalid: Array in variants with invalid class
// @invalidClasses [invalid-in-array]
// @validClasses [bg-blue-500, text-white]
</script>

<template>
  <button :class="button({ color: 'primary' })">Invalid Array Variants</button>
</template>
