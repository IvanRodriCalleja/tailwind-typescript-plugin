<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Ternary with arbitrary values
// @validClasses [flex, h-[50vh], w-[100px], h-[30vh], w-[50px]]
</script>

<template>
  <div :class="clsx('flex', isActive ? 'h-[50vh] w-[100px]' : 'h-[30vh] w-[50px]')">
  			Ternary with arbitrary values
  		</div>
</template>
