<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Object with arbitrary values
// @validClasses [h-[50vh], w-[100px], bg-[#ff0000]]
</script>

<template>
  <div :class="clsx({ 'h-[50vh]': true, 'w-[100px]': true, 'bg-[#ff0000]': isActive })">
  			Arbitrary values
  		</div>
</template>
