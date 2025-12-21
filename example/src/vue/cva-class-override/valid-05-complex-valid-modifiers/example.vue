<script setup lang="ts">
import { cva } from 'class-variance-authority';

// ✅ Valid: Complex valid classes with modifiers
// @validClasses [md:bg-purple-600, lg:hover:bg-purple-800, dark:bg-purple-900]
</script>

<template>
  <button
  			:class="button({
  				intent: 'primary',
  				class: 'md:bg-purple-600 lg:hover:bg-purple-800 dark:bg-purple-900'
  			})">
  			Complex Valid Modifiers
  		</button>
</template>
