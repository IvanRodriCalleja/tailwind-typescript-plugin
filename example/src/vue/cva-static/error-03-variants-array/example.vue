<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ❌ Invalid: Variant with invalid class in array
// @invalidClasses [invalid-variant-class]
// @validClasses [bg-blue-500, text-white]
</script>

<template>
  <button :class="button({ intent: 'primary' })">Invalid Variant</button>
</template>
