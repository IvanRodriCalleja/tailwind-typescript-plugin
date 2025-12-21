<script setup lang="ts">
import { cn } from '../utils';

const isActive = true;
const hasError = false;
const isLoading = false;

// ❌ Invalid: Mixed binary ternary with invalid
// @invalidClasses [invalid-start]
// @validClasses [flex, items-center, justify-center, bg-blue-500, bg-red-500]
</script>

<template>
  <div
  			:class="cn(
  				[hasError && 'flex'],
  				{ 'items-center': [isActive ? 'justify-center' : 'invalid-start', 'bg-blue-500'] },
  				hasError && [isLoading ? 'bg-red-500' : 'bg-green-500']
  			)">
  			Invalid mixed
  		</div>
</template>
