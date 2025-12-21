<script setup lang="ts">
import { cva } from 'class-variance-authority';

const button = cva(['flex', 'flex', 'items-center']);

// ⚠️ Warning: Duplicate in base array
// @duplicateClasses [flex, flex]
</script>

<template>
  <button :class="button()">Duplicate in base array</button>
</template>
