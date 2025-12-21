<script setup lang="ts">
import { cva } from 'class-variance-authority';

const button = cva(['flex', 'p-4', 'flex', 'p-4', 'items-center']);

// ⚠️ Warning: Multiple duplicates in base
// @duplicateClasses [flex, flex, p-4, p-4]
</script>

<template>
  <button :class="button()">Multiple duplicates in base</button>
</template>
