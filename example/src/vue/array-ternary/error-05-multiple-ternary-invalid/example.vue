<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;
const isDisabled = false;

// ❌ Invalid: Multiple ternary expressions with invalid classes
// @invalidClasses [invalid-active, invalid-disabled]
// @validClasses [flex, bg-gray-500, text-black]
</script>

<template>
  <div
  			:class="cn([
  				'flex',
  				isActive ? 'invalid-active' : 'bg-gray-500',
  				isDisabled ? 'invalid-disabled' : 'text-black'
  			])">
  			Multiple ternary with invalid
  		</div>
</template>
