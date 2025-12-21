<script setup lang="ts">
import { cn } from '../utils';

// ✅ Valid: Variadic arrays with objects and nested arrays (clsx docs pattern)
// Example: clsx(['foo'], ['', 0, false, 'bar'], [['baz', [['hello'], 'there']]])
// @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold]
</script>

<template>
  <div
  			:class="cn(
  				['flex'],
  				['', 0, false, 'items-center'],
  				[['justify-center', [['bg-blue-500'], 'text-white']]],
  				'font-bold'
  			)">
  			Variadic complex
  		</div>
</template>
