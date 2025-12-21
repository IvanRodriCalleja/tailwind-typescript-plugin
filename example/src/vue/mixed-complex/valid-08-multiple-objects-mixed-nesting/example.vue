<script setup lang="ts">
import { clsx } from 'clsx';

const isActive = true;

// ✅ Valid: Multiple objects with mixed nested structures
// @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold, p-4]
</script>

<template>
  <div
  			:class="clsx(
  				{ flex: ['items-center', 'justify-center'] },
  				{ 'bg-blue-500': [{ 'text-white': true, 'font-bold': isActive }] },
  				'p-4'
  			)">
  			Multiple objects mixed
  		</div>
</template>
