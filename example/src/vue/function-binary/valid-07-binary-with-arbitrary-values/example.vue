<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Binary with arbitrary values
// @validClasses [flex, h-[50vh], w-[100px]]
</script>

<template>
  <div :class="clsx('flex', isActive && 'h-[50vh] w-[100px]')">
  			Binary with arbitrary values
  		</div>
</template>
