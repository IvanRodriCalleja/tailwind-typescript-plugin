<script setup lang="ts">
import { cn } from '../utils';

// ✅ Valid: Multiple variadic nested arrays (like clsx docs)
// Example: clsx(['foo'], ['', 0, false, 'bar'], [['baz', [['hello'], 'there']]])
// @validClasses [flex, items-center, justify-center, bg-blue-500, text-white]
</script>

<template>
  <div
  			:class="cn(
  				['flex'],
  				['', 0, false, 'items-center'],
  				[['justify-center', [['bg-blue-500'], 'text-white']]]
  			)">
  			Variadic nested
  		</div>
</template>
