<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Mix of static strings and ternary expressions
// @validClasses [flex, items-center, bg-blue-500, bg-gray-500, font-bold]
</script>

<template>
  <div
  			:class="clsx(
  				'flex',
  				'items-center',
  				isActive ? 'bg-blue-500' : 'bg-gray-500',
  				'font-bold'
  			)">
  			Mixed static and ternary
  		</div>
</template>
