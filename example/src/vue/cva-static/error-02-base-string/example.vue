<script setup lang="ts">
import { cva } from 'class-variance-authority';

const button = cva('font-semibold invalid-base-string border');

// ❌ Invalid: String with invalid class
// @invalidClasses [invalid-base-string]
// @validClasses [font-semibold, border]
</script>

<template>
  <button :class="button()">Invalid Base String</button>
</template>
