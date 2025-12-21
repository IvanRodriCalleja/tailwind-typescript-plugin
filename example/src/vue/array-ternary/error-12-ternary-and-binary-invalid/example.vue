<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;
const hasError = false;

// ❌ Invalid: Array with ternary and binary with invalid
// @invalidClasses [invalid-active, invalid-error]
// @validClasses [flex, bg-gray-500]
</script>

<template>
  <div
  			:class="cn([
  				'flex',
  				isActive ? 'invalid-active' : 'bg-gray-500',
  				hasError && 'invalid-error'
  			])">
  			Ternary and binary with invalid
  		</div>
</template>
