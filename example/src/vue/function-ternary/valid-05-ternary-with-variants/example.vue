<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Ternary with Tailwind variants
// @validClasses [flex, hover:bg-blue-500, md:text-lg, hover:bg-gray-500, md:text-sm]
</script>

<template>
  <div
  			:class="clsx(
  				'flex',
  				isActive ? 'hover:bg-blue-500 md:text-lg' : 'hover:bg-gray-500 md:text-sm'
  			)">
  			Ternary with variants
  		</div>
</template>
