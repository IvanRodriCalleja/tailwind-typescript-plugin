<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ✅ Valid: Mix of static and ternary in array
// @validClasses [flex, items-center, bg-blue-500, bg-gray-500, font-bold]
</script>

<template>
  <div
  			:class="cn([
  				'flex',
  				'items-center',
  				isActive ? 'bg-blue-500' : 'bg-gray-500',
  				'font-bold'
  			])">
  			Mixed static and ternary
  		</div>
</template>
