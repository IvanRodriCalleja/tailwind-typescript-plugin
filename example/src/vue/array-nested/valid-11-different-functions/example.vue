<script setup lang="ts">
import { clsx } from 'clsx';
import { cn } from '../utils';

// ✅ Valid: Nested arrays in different utility functions
// @validClasses [flex, items-center, justify-center]
</script>

<template>
  <>
  			<div :class="clsx([['flex', 'items-center']])">clsx nested</div>
  			<div :class="cn([['justify-center']])">cn nested</div>
  		</>
</template>
