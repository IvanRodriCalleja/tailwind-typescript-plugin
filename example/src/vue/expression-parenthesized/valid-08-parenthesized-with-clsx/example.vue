<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Parenthesized with clsx
// @validClasses [flex, bg-blue-500]
</script>

<template>
  <div :class="clsx('flex', isActive && 'bg-blue-500')">Parenthesized clsx</div>
</template>
