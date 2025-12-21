<script setup lang="ts">
import { clsx } from 'clsx';

// ✅ Valid: Multiple objects with array values
// @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold]
</script>

<template>
  <div
  			:class="clsx(
  				{ flex: ['items-center', 'justify-center'] },
  				{ 'bg-blue-500': ['text-white', 'font-bold'] }
  			)">
  			Multiple objects with arrays
  		</div>
</template>
