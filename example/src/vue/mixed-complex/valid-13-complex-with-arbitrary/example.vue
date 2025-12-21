<script setup lang="ts">
import { clsx } from 'clsx';

// ✅ Valid: With arbitrary values in complex nesting
// @validClasses [flex, h-[50vh], w-[100px], bg-[#ff0000], p-[20px]]
</script>

<template>
  <div :class="clsx('flex', { 'h-[50vh]': ['w-[100px]', 'bg-[#ff0000]'] }, [['p-[20px]']])">
  			Complex with arbitrary
  		</div>
</template>
