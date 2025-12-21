<script setup lang="ts">
import clsx from 'clsx';

const isError = false;

// ✅ Valid: Mix of static strings and binary expressions
// @validClasses [flex, items-center, text-red-500, font-bold]
</script>

<template>
  <div :class="clsx('flex', 'items-center', isError && 'text-red-500', 'font-bold')">
  			Mixed static and binary
  		</div>
</template>
