<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ✅ Valid: Variants as strings
// @validClasses [bg-blue-500, text-white, border-transparent, hover:bg-blue-600]
</script>

<template>
  <button :class="button({ intent: 'primary' })">Valid String Variant</button>
</template>
