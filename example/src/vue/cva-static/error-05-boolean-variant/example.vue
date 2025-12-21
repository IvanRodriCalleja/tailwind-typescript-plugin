<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ❌ Invalid: Boolean variant with invalid class
// @invalidClasses [invalid-disabled-class]
// @validClasses [opacity-50]
</script>

<template>
  <button :class="button({ disabled: true })">Invalid Boolean Variant</button>
</template>
