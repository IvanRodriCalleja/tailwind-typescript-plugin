<script setup lang="ts">
import { cva } from 'class-variance-authority';

const mixedClasses = 'flex invalid-cva-mixed-var items-center';
const button = cva(mixedClasses);

// ❌ Invalid: Variable with mixed valid/invalid classes in base
// @invalidClasses [invalid-cva-mixed-var]
// @validClasses [flex, items-center]
</script>

<template>
  <button :class="button()">Mixed Base Variable</button>
</template>
