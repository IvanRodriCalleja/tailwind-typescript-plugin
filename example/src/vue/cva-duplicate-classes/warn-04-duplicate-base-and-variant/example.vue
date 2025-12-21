<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ⚠️ Warning: Class in base repeated in variant
// @duplicateClasses [flex, flex]
</script>

<template>
  <button :class="button({ intent: 'primary' })">Duplicate base + variant</button>
</template>
