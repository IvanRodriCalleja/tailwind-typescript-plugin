<script setup lang="ts">
import { clsx as cn } from 'clsx';

const isActive = true;

// ✅ Valid: Ternary with arbitrary values in array
// @validClasses [flex, h-[50vh], w-[100px], h-[30vh], w-[50px]]
</script>

<template>
  <div :class="cn(['flex', isActive ? 'h-[50vh] w-[100px]' : 'h-[30vh] w-[50px]'])">
  			Ternary with arbitrary values
  		</div>
</template>
