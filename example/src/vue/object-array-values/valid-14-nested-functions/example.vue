<script setup lang="ts">
import { clsx } from 'clsx';
import { cn } from '../utils';

// ✅ Valid: Nested function calls with object array values
// @validClasses [flex, items-center, justify-center, bg-blue-500]
</script>

<template>
  <div :class="cn([clsx({ flex: ['items-center', 'justify-center'] }), 'bg-blue-500'])">
  			Nested functions
  		</div>
</template>
