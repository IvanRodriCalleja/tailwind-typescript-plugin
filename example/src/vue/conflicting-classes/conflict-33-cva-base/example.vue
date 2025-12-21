<script setup lang="ts">
import { cva } from 'class-variance-authority';

const button = cva(['flex', 'grid', 'items-center']);

// ⚠️ Warning: Conflict in cva() base array
// @conflictClasses [flex, grid]
</script>

<template>
  <button :class="button()">CVA base conflict</button>
</template>
