<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = true;
const hasWarning = false;
const isDisabled = false;

// ❌ Invalid: Complex array with multiple conditions
// @invalidClasses [invalid-disabled]
// @validClasses [flex, text-red-500, bg-yellow-100]
</script>

<template>
  <div
  			:class="cn([
  				'flex',
  				isError && 'text-red-500',
  				hasWarning && 'bg-yellow-100',
  				isDisabled && 'invalid-disabled'
  			])">
  			Complex conditions in array
  		</div>
</template>
