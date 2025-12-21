<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;
const isDisabled = false;

// ✅ Valid: Multiple arguments with ternary expressions, all valid
// @validClasses [flex, bg-blue-500, bg-gray-500, text-white, text-black]
</script>

<template>
  <div
  			:class="clsx(
  				'flex',
  				isActive ? 'bg-blue-500' : 'bg-gray-500',
  				isDisabled ? 'text-white' : 'text-black'
  			)">
  			Multiple ternary arguments
  		</div>
</template>
