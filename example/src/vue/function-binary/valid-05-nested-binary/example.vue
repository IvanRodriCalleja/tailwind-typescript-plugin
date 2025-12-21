<script setup lang="ts">
import clsx from 'clsx';

const isError = false;
const isActive = true;

// ✅ Valid: Nested binary expressions
// @validClasses [flex, text-red-500, font-bold]
</script>

<template>
  <div :class="clsx('flex', isError && isActive && 'text-red-500 font-bold')">
  			Nested binary
  		</div>
</template>
