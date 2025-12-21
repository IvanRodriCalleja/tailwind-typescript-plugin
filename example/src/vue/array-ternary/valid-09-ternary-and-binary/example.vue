<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;
const hasError = false;

// ✅ Valid: Array with ternary and binary combined
// @validClasses [flex, bg-blue-500, bg-gray-500, text-red-500]
</script>

<template>
  <div
  			:class="cn([
  				'flex',
  				isActive ? 'bg-blue-500' : 'bg-gray-500',
  				hasError && 'text-red-500'
  			])">
  			Ternary and binary in array
  		</div>
</template>
