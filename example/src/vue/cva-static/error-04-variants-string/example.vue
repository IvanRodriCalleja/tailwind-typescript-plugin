<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ❌ Invalid: Variant string with invalid class
// @invalidClasses [invalid-string-variant]
// @validClasses [bg-blue-500, text-white]
</script>

<template>
  <button :class="button({ intent: 'primary' })">Invalid String Variant</button>
</template>
