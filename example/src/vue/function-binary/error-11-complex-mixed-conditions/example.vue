<script setup lang="ts">
import clsx from 'clsx';

const isError = false;
const hasWarning = false;
const isDisabled = false;

// ❌ Invalid: Complex mix with multiple conditions
// @invalidClasses [invalid-disabled]
// @validClasses [flex, text-red-500, bg-yellow-100]
</script>

<template>
  <div
  			:class="clsx(
  				'flex',
  				isError && 'text-red-500',
  				hasWarning && 'bg-yellow-100',
  				isDisabled && 'invalid-disabled'
  			)">
  			Complex mixed conditions
  		</div>
</template>
