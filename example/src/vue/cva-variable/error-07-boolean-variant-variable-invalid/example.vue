<script setup lang="ts">
import { cva } from 'class-variance-authority';

const invalidBase = 'invalid-cva-base-var';

// ❌ Invalid: Boolean variant with invalid variable for true
// @invalidClasses [invalid-cva-base-var]
</script>

<template>
  <button :class="button({ active: true })">Invalid Boolean Variable</button>
</template>
