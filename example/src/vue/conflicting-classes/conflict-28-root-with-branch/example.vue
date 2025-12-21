<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ⚠️ Warning: Root class conflicts with branch class
// @conflictClasses [text-left, text-center]
</script>

<template>
  <div :class="clsx('text-left', isActive && 'text-center')">Root conflicts with branch</div>
</template>
