<script setup lang="ts">
import { cva } from 'class-variance-authority';

const invalidBase = 'invalid-cva-base-var';
const button = cva(invalidBase);

// ❌ Invalid: Variable with invalid class in base (string)
// @invalidClasses [invalid-cva-base-var]
</script>

<template>
  <button :class="button()">Invalid Base Variable String</button>
</template>
