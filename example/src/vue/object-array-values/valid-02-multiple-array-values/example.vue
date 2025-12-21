<script setup lang="ts">
import { clsx } from 'clsx';

// ✅ Valid: Multiple properties with array values
// @validClasses [flex, items-center, justify-center, bg-blue-500, text-white]
</script>

<template>
  <div
  			:class="clsx({ flex: ['items-center', 'justify-center'], 'bg-blue-500': ['text-white'] })">
  			Multiple arrays
  		</div>
</template>
