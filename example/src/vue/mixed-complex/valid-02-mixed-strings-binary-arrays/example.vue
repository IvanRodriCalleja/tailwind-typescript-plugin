<script setup lang="ts">
import { cn } from '../utils';

const isActive = true;

// ✅ Valid: Mix of strings, binary, and nested arrays
// @validClasses [flex, items-center, justify-center, bg-blue-500, text-white]
</script>

<template>
  <div
  			:class="cn(
  				'flex',
  				isActive && 'items-center',
  				[['justify-center', 'bg-blue-500']],
  				'text-white'
  			)">
  			Mixed types
  		</div>
</template>
