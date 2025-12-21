<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Ternary with null/undefined (ignored)
// @validClasses [flex, bg-blue-500]
</script>

<template>
  <div :class="clsx('flex', isActive ? 'bg-blue-500' : null)">Ternary with null</div>
</template>
