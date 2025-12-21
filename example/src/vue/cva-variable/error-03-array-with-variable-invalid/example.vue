<script setup lang="ts">
import { cva } from 'class-variance-authority';

const invalidBase = 'invalid-cva-base-var';
const button = cva([invalidBase, 'gap-2']);

// ❌ Invalid: Array base with invalid variable element
// @invalidClasses [invalid-cva-base-var]
// @validClasses [gap-2]
</script>

<template>
  <button :class="button()">Invalid Array Variable</button>
</template>
