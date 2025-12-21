<script setup lang="ts">
import { cn } from '../utils';

const isActive = true;

// ✅ Valid: Nested objects with array values inside arrays
// @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold]
</script>

<template>
  <div
  			:class="cn([
  				'flex',
  				{ 'items-center': ['justify-center', 'bg-blue-500'] },
  				[{ 'text-white': true, 'font-bold': isActive }]
  			])">
  			Nested complex
  		</div>
</template>
