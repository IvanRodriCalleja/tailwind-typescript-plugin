<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;
const hasError = false;

// ❌ Invalid: Ternary and binary with invalid classes
// @invalidClasses [invalid-active, invalid-error]
// @validClasses [flex, bg-gray-500]
</script>

<template>
  <div
  			:class="clsx(
  				'flex',
  				isActive ? 'invalid-active' : 'bg-gray-500',
  				hasError && 'invalid-error'
  			)">
  			Ternary and binary with invalid
  		</div>
</template>
