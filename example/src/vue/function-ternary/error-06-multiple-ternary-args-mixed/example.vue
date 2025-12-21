<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;
const isDisabled = false;

// ❌ Invalid: Mix of valid and invalid ternary arguments
// @invalidClasses [invalid-disabled]
// @validClasses [flex, bg-blue-500, bg-gray-500, text-black]
</script>

<template>
  <div
  			:class="clsx(
  				'flex',
  				isActive ? 'bg-blue-500' : 'bg-gray-500',
  				isDisabled ? 'invalid-disabled' : 'text-black'
  			)">
  			Mixed ternary arguments
  		</div>
</template>
