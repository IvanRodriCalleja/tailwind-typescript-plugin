<script setup lang="ts">
import { cva } from 'class-variance-authority';

const invalidVariant = 'invalid-cva-variant-var';

// ❌ Invalid: Variable with invalid class in variant
// @invalidClasses [invalid-cva-variant-var]
</script>

<template>
  <button :class="button({ color: 'primary' })">Invalid Variant Variable</button>
</template>
