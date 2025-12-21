<script setup lang="ts">
import clsx from 'clsx';

// ✅ Valid: Self-closing element with valid classes
// @validClasses [w-full, h-auto, rounded-lg]
</script>

<template>
  <img :class="clsx('w-full', 'h-auto', 'rounded-lg')" src="test.jpg" alt="test" />
</template>
