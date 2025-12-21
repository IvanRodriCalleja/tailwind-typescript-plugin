<script setup lang="ts">
import { cva } from 'class-variance-authority';

const button = cva(['font-semibold', 'invalid-base-class', 'border']);

// ❌ Invalid: Array with invalid class
// @invalidClasses [invalid-base-class]
// @validClasses [font-semibold, border]
</script>

<template>
  <button :class="button()">Invalid Base Array</button>
</template>
