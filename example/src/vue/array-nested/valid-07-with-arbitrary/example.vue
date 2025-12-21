<script setup lang="ts">
import { cn } from '../utils';

// ✅ Valid: Nested arrays with arbitrary values
// @validClasses [flex, h-[50vh], w-[100px], bg-[#ff0000]]
</script>

<template>
  <div
  			:class="cn([
  				['flex', 'h-[50vh]'],
  				['w-[100px]', 'bg-[#ff0000]']
  			])">
  			With arbitrary
  		</div>
</template>
