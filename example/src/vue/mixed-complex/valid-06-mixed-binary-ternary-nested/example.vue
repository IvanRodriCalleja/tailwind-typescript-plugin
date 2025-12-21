<script setup lang="ts">
import { cn } from '../utils';

const isActive = true;
const hasError = false;
const isLoading = false;

// ✅ Valid: Binary and ternary mixed in nested structures
// @validClasses [flex, items-center, justify-center, bg-blue-500, bg-red-500, text-white]
</script>

<template>
  <div
  			:class="cn(
  				[hasError && 'flex'],
  				{ 'items-center': [isActive ? 'justify-center' : 'justify-start', 'bg-blue-500'] },
  				hasError && [isLoading ? 'bg-red-500' : 'bg-green-500', 'text-white']
  			)">
  			Mixed binary ternary
  		</div>
</template>
