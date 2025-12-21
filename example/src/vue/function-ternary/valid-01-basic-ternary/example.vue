<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Function with ternary expression, all valid classes
// @validClasses [flex, bg-blue-500, bg-gray-500]
</script>

<template>
  <div :class="clsx('flex', isActive ? 'bg-blue-500' : 'bg-gray-500')">
  			Function with ternary expression
  		</div>
</template>
