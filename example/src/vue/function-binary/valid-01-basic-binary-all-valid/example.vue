<script setup lang="ts">
import clsx from 'clsx';

const isError = false;

// ✅ Valid: Function with binary expression, valid class
// @validClasses [flex, text-red-500]
</script>

<template>
  <div :class="clsx('flex', isError && 'text-red-500')">Function with binary expression</div>
</template>
