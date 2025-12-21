<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;
const hasError = false;
const isLoading = false;

// ❌ Invalid: Complex array with multiple conditions
// @invalidClasses [invalid-loading]
// @validClasses [flex, bg-blue-500, bg-gray-500, text-red-500]
</script>

<template>
  <div
  			:class="cn([
  				'flex',
  				isActive ? 'bg-blue-500' : 'bg-gray-500',
  				hasError && 'text-red-500',
  				isLoading ? 'invalid-loading' : ''
  			])">
  			Complex conditions
  		</div>
</template>
