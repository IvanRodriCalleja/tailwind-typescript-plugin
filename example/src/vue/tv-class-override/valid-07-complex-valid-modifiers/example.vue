<script setup lang="ts">
import { tv } from 'tailwind-variants';

// ✅ Valid: Complex valid classes with modifiers
// @validClasses [md:bg-purple-600, lg:hover:bg-purple-800, dark:bg-purple-900]
</script>

<template>
  <button
  			:class="button({
  				color: 'primary',
  				class: 'md:bg-purple-600 lg:hover:bg-purple-800 dark:bg-purple-900'
  			})">
  			Complex Valid Modifiers
  		</button>
</template>
