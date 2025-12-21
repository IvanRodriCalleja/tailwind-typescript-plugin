<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ⚠️ Warning: Duplicate within same variant value
// @duplicateClasses [bg-blue-500, bg-blue-500]
</script>

<template>
  <button :class="button({ intent: 'primary' })">Duplicate within variant</button>
</template>
