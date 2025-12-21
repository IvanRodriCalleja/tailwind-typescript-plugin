<script setup lang="ts">
import clsx from 'clsx';

// ❌ Invalid: Invalid class in first argument
// @invalidClasses [invalid-first]
// @validClasses [items-center, justify-center]
</script>

<template>
  <div :class="clsx('invalid-first', 'items-center', 'justify-center')">Invalid in first</div>
</template>
