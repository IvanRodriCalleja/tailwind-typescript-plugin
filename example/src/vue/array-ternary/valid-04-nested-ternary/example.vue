<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;
const isDisabled = false;

// ✅ Valid: Nested ternary expressions in array
// @validClasses [flex, bg-blue-500, bg-green-500, bg-gray-500]
</script>

<template>
  <div
  			:class="cn([
  				'flex',
  				isActive ? (isDisabled ? 'bg-blue-500' : 'bg-green-500') : 'bg-gray-500'
  			])">
  			Nested ternary in array
  		</div>
</template>
