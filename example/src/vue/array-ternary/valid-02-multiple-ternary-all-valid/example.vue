<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;
const isDisabled = false;

// ✅ Valid: Multiple ternary expressions in array, all valid
// @validClasses [flex, bg-blue-500, bg-gray-500, text-white, text-black]
</script>

<template>
  <div
  			:class="cn([
  				'flex',
  				isActive ? 'bg-blue-500' : 'bg-gray-500',
  				isDisabled ? 'text-white' : 'text-black'
  			])">
  			Multiple ternary in array
  		</div>
</template>
