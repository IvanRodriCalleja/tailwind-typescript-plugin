<script setup lang="ts">
import clsx from 'clsx';

const isActive = true;

// ✅ Valid: Ternary in function call wrapper
// Note: This is a function pattern, not pure expression
// @validClasses [flex, bg-blue-500, bg-gray-500]
</script>

<template>
  <div :class="clsx('flex', isActive ? 'bg-blue-500' : 'bg-gray-500')">
  			Ternary in function
  		</div>
</template>
