<script setup lang="ts">
import { cva } from 'class-variance-authority';

const button = cva('font-semibold border rounded');

// ✅ Valid: String of valid base classes
// @validClasses [font-semibold, border, rounded]
</script>

<template>
  <button :class="button()">Valid Base String</button>
</template>
