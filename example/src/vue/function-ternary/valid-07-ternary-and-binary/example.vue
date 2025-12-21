<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;
const hasError = false;

// ✅ Valid: Ternary and binary combined in function
// @validClasses [flex, bg-blue-500, bg-gray-500, text-red-500]
</script>

<template>
  <div
  			:class="clsx(
  				'flex',
  				isActive ? 'bg-blue-500' : 'bg-gray-500',
  				hasError && 'text-red-500'
  			)">
  			Ternary and binary in function
  		</div>
</template>
