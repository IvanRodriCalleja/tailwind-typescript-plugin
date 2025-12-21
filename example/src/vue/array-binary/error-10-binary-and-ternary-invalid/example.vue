<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isError = true;
const isActive = true;

// ❌ Invalid: Array with binary and ternary with invalid
// @invalidClasses [invalid-error, invalid-active]
// @validClasses [flex, bg-gray-500]
</script>

<template>
  <div
  			:class="cn([
  				'flex',
  				isError && 'invalid-error',
  				isActive ? 'invalid-active' : 'bg-gray-500'
  			])">
  			Binary and ternary with invalid
  		</div>
</template>
