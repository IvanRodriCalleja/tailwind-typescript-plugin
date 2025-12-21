<script setup lang="ts">
import { clsx } from 'clsx';

const isActive = true;

// ✅ Valid: With Tailwind variants in complex nesting
// @validClasses [flex, hover:bg-blue-500, md:flex-col, lg:items-center, dark:text-white, sm:justify-center]
</script>

<template>
  <div
  			:class="clsx(
  				['flex', isActive && 'hover:bg-blue-500'],
  				{ 'md:flex-col': ['lg:items-center', 'dark:text-white'] },
  				[['sm:justify-center']]
  			)">
  			Complex with variants
  		</div>
</template>
