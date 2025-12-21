<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;
const isDisabled = false;

// ✅ Valid: Nested ternary expressions
// @validClasses [flex, bg-blue-500, bg-green-500, bg-gray-500]
</script>

<template>
  <div
  			:class="clsx(
  				'flex',
  				isActive ? (isDisabled ? 'bg-blue-500' : 'bg-green-500') : 'bg-gray-500'
  			)">
  			Nested ternary
  		</div>
</template>
