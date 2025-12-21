<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Ternary that might resolve to boolean (ignored)
// @validClasses [flex, bg-blue-500]
</script>

<template>
  <div :class="clsx('flex', isActive ? 'bg-blue-500' : false)">Ternary with boolean</div>
</template>
