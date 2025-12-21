<script setup lang="ts">
import { clsx } from 'clsx';
import { cn } from '../utils';

// ✅ Valid: Nested function calls with complex structures
// @validClasses [flex, items-center, justify-center, bg-blue-500, text-white]
</script>

<template>
  <div
  			:class="cn(clsx('flex', { 'items-center': ['justify-center'] }), [
  				clsx({ 'bg-blue-500': true }),
  				'text-white'
  			])">
  			Nested functions
  		</div>
</template>
