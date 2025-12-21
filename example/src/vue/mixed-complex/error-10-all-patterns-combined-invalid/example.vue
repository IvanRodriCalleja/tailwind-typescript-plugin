<script setup lang="ts">
import { clsx } from 'clsx';

const isActive = true;
const hasError = false;

// ❌ Invalid: All patterns combined with invalid
// @invalidClasses [invalid-all]
// @validClasses [flex, items-center, justify-center, bg-blue-500, text-white, font-bold, p-4]
</script>

<template>
  <div
  			:class="clsx(
  				'flex',
  				isActive && 'items-center',
  				hasError ? 'justify-center' : 'justify-start',
  				{ 'bg-blue-500': isActive },
  				['text-white', { 'font-bold': ['p-4', isActive && 'invalid-all'] }]
  			)">
  			Invalid all patterns
  		</div>
</template>
