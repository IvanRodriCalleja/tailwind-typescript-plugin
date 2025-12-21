<script setup lang="ts">
import { cva } from 'class-variance-authority';

const validBase = 'flex items-center';
const button = cva([validBase, 'gap-2']);

// ✅ Valid: Array base with variable element
// @validClasses [flex, items-center, gap-2]
</script>

<template>
  <button :class="button()">Valid Array Variable</button>
</template>
