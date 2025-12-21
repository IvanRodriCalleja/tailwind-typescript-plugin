<script setup lang="ts">
import { cn } from '../utils';

// ✅ Valid: Nested arrays with Tailwind variants
// @validClasses [flex, hover:bg-blue-500, md:flex-col, lg:items-center]
</script>

<template>
  <div
  			:class="cn([
  				['flex', 'hover:bg-blue-500'],
  				['md:flex-col', 'lg:items-center']
  			])">
  			With variants
  		</div>
</template>
