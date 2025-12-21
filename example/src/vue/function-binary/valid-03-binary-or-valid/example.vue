<script setup lang="ts">
import clsx from 'clsx';

const isError = false;

// ✅ Valid: Function with OR binary expression
// @validClasses [flex, bg-gray-500]
</script>

<template>
  <div :class="clsx('flex', isError || 'bg-gray-500')">Function with OR expression</div>
</template>
