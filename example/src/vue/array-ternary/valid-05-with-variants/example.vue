<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ✅ Valid: Ternary with Tailwind variants in array
// @validClasses [flex, hover:bg-blue-500, md:text-lg, hover:bg-gray-500, md:text-sm]
</script>

<template>
  <div
  			:class="cn([
  				'flex',
  				isActive ? 'hover:bg-blue-500 md:text-lg' : 'hover:bg-gray-500 md:text-sm'
  			])">
  			Ternary with variants
  		</div>
</template>
