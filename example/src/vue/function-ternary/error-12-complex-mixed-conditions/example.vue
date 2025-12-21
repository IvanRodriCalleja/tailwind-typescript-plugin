<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;
const hasError = false;
const isLoading = false;

// ❌ Invalid: Complex mix with multiple conditions
// @invalidClasses [invalid-loading]
// @validClasses [flex, bg-blue-500, bg-gray-500, text-red-500]
</script>

<template>
  <div
  			:class="clsx(
  				'flex',
  				isActive ? 'bg-blue-500' : 'bg-gray-500',
  				hasError && 'text-red-500',
  				isLoading ? 'invalid-loading' : ''
  			)">
  			Complex mixed conditions
  		</div>
</template>
