<script setup lang="ts">
import { cva } from 'class-variance-authority';

const validBase = 'flex items-center';
const button = cva(validBase);

// ✅ Valid: Variable with valid classes in base (string)
// @validClasses [flex, items-center]
</script>

<template>
  <button :class="button()">Valid Base Variable String</button>
</template>
