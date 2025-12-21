<script setup lang="ts">
import { clsx as cn } from 'clsx';
import clsx from 'clsx';

const isError = false;

// ✅ Valid: Nested functions with binary expressions
// @validClasses [flex, text-red-500, items-center]
</script>

<template>
  <div :class="clsx('flex', cn(isError && 'text-red-500', 'items-center'))">
  			Nested functions with binary
  		</div>
</template>
