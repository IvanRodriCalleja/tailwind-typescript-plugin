<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;
const isDisabled = false;

// ❌ Invalid: Nested ternary with invalid class
// @invalidClasses [invalid-nested]
// @validClasses [flex, bg-green-500, bg-gray-500]
</script>

<template>
  <div
  			:class="cn([
  				'flex',
  				isActive ? (isDisabled ? 'invalid-nested' : 'bg-green-500') : 'bg-gray-500'
  			])">
  			Nested ternary invalid
  		</div>
</template>
