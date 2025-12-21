<script setup lang="ts">
import { cva } from 'class-variance-authority';

const button = cva(['p-4', 'pt-2', 'px-6', 'py-3']);

// ✅ Valid: Similar but different classes
// @validClasses [p-4, pt-2, px-6, py-3]
</script>

<template>
  <button :class="button()">Similar classes</button>
</template>
