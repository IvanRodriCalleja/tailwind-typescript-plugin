<script setup lang="ts">
import { clsx } from 'clsx';

const isActive = true;
const hasError = false;

// ✅ Valid: All patterns combined (strings, binary, ternary, objects, arrays, nested)
// @validClasses [flex, items-center, justify-center, bg-blue-500, bg-gray-500, text-white, font-bold, p-4, hover:bg-red-500]
</script>

<template>
  <div
  			:class="clsx(
  				'flex',
  				isActive && 'items-center',
  				hasError ? 'justify-center' : 'justify-start',
  				{ 'bg-blue-500': isActive, 'bg-gray-500': !isActive },
  				['text-white', { 'font-bold': ['p-4', isActive && 'hover:bg-red-500'] }]
  			)">
  			All patterns
  		</div>
</template>
